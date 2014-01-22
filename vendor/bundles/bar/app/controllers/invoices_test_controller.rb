class InvoiceTestController < ProcedureResourcesController
  
  skip_before_filter :verify_authenticity_token
  
  public
  
  #
  # GET /domains/:domain_id/invoices.json
  #
  def index
    result = {}
    begin
      conn = ActiveRecord::Base.connection()
      master_sql = "SELECT 
          TO_CHAR(TO_DATE(I.BILL_DT, 'YYYYMMDD'), 'YYYY-MM-DD') BILL_DT,
          TO_CHAR(TO_DATE(I.INVOICE_DATE, 'YYYYMMDD'), 'YYYY-MM-DD') INVOICE_DATE,
          I.TR_CD, S.DESCRIPTION TR_NM, INVOICE_NO, PO_NO, TR_CD
        FROM 
          BAR_INVHEAD I, SUPPLIERS S 
        WHERE 
          I.TR_CD = S.NAME AND
          I.BILL_NB = '#{params[:bill_nb]}'"
      detail_sql = "SELECT I.*, P.DESCRIPTION ITEM_NM FROM BAR_INVDETAIL I, PRODUCTS P WHERE I.BILL_NB = '#{params[:bill_nb]}' AND I.ITEM_CD = P.NAME"
      master = conn.select_all(master_sql)
      details = conn.select_all(detail_sql)
      result = {
        :master => master[0],
        :items => details,
        :total_count => details.size,
        :success => true
      }
    rescue Exception => e
      raise Hatio::Exception::InvalidRequest, "ERROR : #{e.to_s}"
    end
        
    respond_to do |format|
      format.xml  { render :xml => result }
      format.json { render :json => result }
      format.xls
    end
  end
  
  #
  # GET /domains/:domain_id/invoices/:id/show.json
  #  
  def show
    tr_cd = params[:id]
    conn = ActiveRecord::Base.connection()
    sql = "SELECT 
      TR_CD ID, TR_CD, TR_NM, ATTR_NM, TR_FG, REG_NB, PPL_NB, CEO_NM, BUSINESS, 
      JONGMOK, ZIP, DIV_ADDR1, ADDR2, DDD, TEL, FAX, TR_NMK, ATTR_NMK, 
      CEO_NMK, USE_YN, REG_ID, REG_DTM, MOD_ID, MOD_DTM
    FROM
      TRADE 
    WHERE
      TR_CD = #{conn.quote(tr_cd)}"
    collection = conn.select_all(sql)
    member = collection.empty? ? nil : collection[0]
    
    respond_to do |format|
      format.xml  { render :xml => member }
      format.json { render :json => member }
    end    
  end
  
  #
  # POST /domains/:domain_id/invoices/create.json
  #  
  def create
    inv_params = params[:invoice]
    item_infos_str, bill_dt, item_sq, r_bill_nb = "", parse_date(inv_params[:bill_dt]).strftime('%Y%m%d'), 1, nil
    inv_params[:item_info].each do |item|
      item_infos_str << "^" unless(item_infos_str.empty?)
      item_infos_str << "#{item_sq}|#{item[:item_cd]}|#{item[:bill_qt]}|#{item[:unit_price]}|#{item[:lot_size]}|#{item[:price]}|#{item[:cust_part_no]}"
      item_sq += 1
    end
    
    begin
      plsql = get_plsql
      r_bill_nb = plsql.SP_BAR_SET_BAR_INV_NEW(
        :arg_language     => 'en',
        :arg_dateformat   => 'YYYY-MM-DD',
        :p_bill_nb        => inv_params[:bill_nb],
        :p_tr_cd          => inv_params[:tr_cd],
        :p_bill_dt        => bill_dt,
        :p_lot_no         => bill_dt,
        :p_print_yn       => '0',
        :arg_invoceno     => inv_params[:invoice_no],
        :arg_pono         => inv_params[:po_no],
        :p_item_info      => item_infos_str,
        :p_reg_id         => current_user.id,
        :p_reg_ip         => request.remote_ip,
        :arg_invoice_date => parse_date(inv_params[:invoice_date]).strftime('%Y%m%d'),
        :r_bill_nb        => r_bill_nb,
      )[:r_bill_nb]
      
    rescue Exception => e
      raise Hatio::Exception::InvalidRequest, "ERROR : #{e.to_s}"
    end    
    
    respond_to do |format|
      format.xml  { render :xml => {:success => true, :msg => "Success", :bill_nb => r_bill_nb} }
      format.json { render :json => {:success => true, :msg => "Success", :bill_nb => r_bill_nb} }
    end
  end
  
  #
  # GET /domains/:domain_id/invoices/:id/update.json
  #  
  def update
    conn = ActiveRecord::Base.connection()    
    sql = "UPDATE 
        TRADE 
      SET
        tr_nm = #{conn.quote(params[:tr_nm])}, 
        attr_nm = #{conn.quote(params[:attr_nm])}, 
        tr_fg = #{conn.quote(params[:tr_fg])},  
        reg_nb = #{conn.quote(params[:reg_nb])}, 
        ppl_nb = #{conn.quote(params[:ppl_nb])}, 
        ceo_nm = #{conn.quote(params[:ceo_nm])},  
        business = #{conn.quote(params[:business])}, 
        jongmok = #{conn.quote(params[:jongmok])}, 
        zip = #{conn.quote(params[:zip])}, 
        div_addr1 = #{conn.quote(params[:div_addr1])}, 
        addr2 = #{conn.quote(params[:addr2])},  
        ddd = #{conn.quote(params[:ddd])}, 
        tel = #{conn.quote(params[:tel])},  
        fax = #{conn.quote(params[:fax])}, 
        tr_nmk = #{conn.quote(params[:tr_nmk])},  
        attr_nmk = #{conn.quote(params[:attr_nmk])},
        ceo_nmk = #{conn.quote(params[:ceo_nmk])}, 
        use_yn = #{conn.quote(params[:use_yn])}, 
        mod_id = #{conn.quote(current_user.id)},  
        mod_dtm = TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')
      WHERE
        TR_CD = #{conn.quote(params[:tr_cd])}"
        
    begin
      conn.execute(sql)
    rescue Exception => e
      raise Hatio::Exception::InvalidRequest, "ERROR : #{e.to_s}"
    end
    
    respond_to do |format|
      format.xml  { render :xml => {:success => true, :msg => "Success"} }
      format.json { render :json => {:success => true, :msg => "Success"} }
    end    
  end
  
  #
  # DELETE /domains/:domain_id/invoices/:id/destroy.json
  #
  def destroy
    tr_cd = params[:id]
    conn = ActiveRecord::Base.connection()
    
    begin
      conn.execute("DELETE FROM TRADE WHERE TR_CD = #{conn.quote(tr_cd)}")
    rescue Exception => e
      raise Hatio::Exception::InvalidRequest, "ERROR : #{e.to_s}"
    end
    
    respond_to do |format|
      format.xml  { render :xml => {:success => true, :msg => "Success"} }
      format.json { render :json => {:success => true, :msg => "Success"} }
    end    
  end  
  
end

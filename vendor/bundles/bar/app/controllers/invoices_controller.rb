class InvoicesController < ProcedureResourcesController
  
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
    bill_nb = params[:id]
    conn = ActiveRecord::Base.connection()
    sql = "SELECT 
          TO_CHAR(TO_DATE(I.BILL_DT, 'YYYYMMDD'), 'YYYY-MM-DD') BILL_DT,
          TO_CHAR(TO_DATE(I.INVOICE_DATE, 'YYYYMMDD'), 'YYYY-MM-DD') INVOICE_DATE,
          I.TR_CD, S.DESCRIPTION TR_NM, INVOICE_NO, PO_NO, TR_CD
        FROM 
          BAR_INVHEAD I, SUPPLIERS S 
        WHERE 
          I.TR_CD = S.NAME AND
          I.BILL_NB = 'bill_nb'"
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
      format.xml  { render :xml => {:success => true, :msg => :Success, :bill_nb => r_bill_nb} }
      format.json { render :json => {:success => true, :msg => :Success, :bill_nb => r_bill_nb} }
    end
  end
  
  #
  # GET /domains/:domain_id/invoices/:id/update.json
  #  
  def update
    conn = ActiveRecord::Base.connection()
    bill_dt = parse_date(params[bill_dt]).strftime("%Y%m%d")
    inv_date = parse_date(params[:invoice_date]).strftime("%Y%m%d")
    
    sql = "UPDATE 
        BAR_INVHEAD 
      SET
        INVOICE_DATE = '#{inv_date}', 
        PO_NO = #{conn.quote(params[:po_no])}, 
        INVOICE_NO = #{conn.quote(params[:invoice_no])}, 
        MOD_ID = #{conn.quote(current_user.id)},  
        MOD_DTM = TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')
      WHERE
        BILL_NB = '#{params[:bill_nb]}'"
        
    begin
      conn.execute(sql)
    rescue Exception => e
      raise Hatio::Exception::InvalidRequest, "ERROR : #{e.to_s}"
    end
    
    respond_to do |format|
      format.xml  { render :xml => {:success => true, :msg => :Success} }
      format.json { render :json => {:success => true, :msg => :Success} }
    end
  end
  
  #
  # DELETE /domains/:domain_id/invoices/:id/destroy.json
  #
  def destroy
    bill_nb = params[:id]
    conn = ActiveRecord::Base.connection()
    
    begin
      conn.execute("DELETE FROM BAR_INVHEAD WHERE BILL_NB = '#{bill_nb}'")
      conn.execute("DELETE FROM BAR_INVDETAIL WHERE BILL_NB = '#{bill_nb}'")
    rescue Exception => e
      raise Hatio::Exception::InvalidRequest, "ERROR : #{e.to_s}"
    end
    
    respond_to do |format|
      format.xml  { render :xml => {:success => true, :msg => :Success} }
      format.json { render :json => {:success => true, :msg => :Success} }
    end
  end
  
  def print_master
    bill_nb = params[:id]
    cmd = 
"^XA~TA000~JSN^LT0^MMT^MNW^MTT^PON^PMN^LH0,0^JMA^PR4,4^MD0^JUS^LRN^CI0^XZ
^XA
^FT516,57^A0R,62,55^FH\^FDHalla Visteon Climate Control(Thailand)Co.,Ltd.^FS
^FT186,61^A0R,52,36^FH\^FDInvoice Date :^FS
^FT186,285^A0R,42,31^FH\^FD${INVOICE_DATE}^FS
^FT277,88^A0R,42,36^FH\^FDInvoice No :^FS
^FT277,285^A0R,42,38^FH\^FD${INVOICE_NO}^FS
^FT360,69^A0R,52,36^FH\^FDInternal No. :^FS
^FT360,285^A0R,42,40^FH\^FD${BILL_NB}^FS
^FT95,110^A0R,48,40^FH\^FDP/O No. :^FS
^FT95,285^A0R,42,45^FH\^FD${PO_NO}^FS
^BY260,260^FT445,800^BXI,4,200,0,0,1
^FH\^FD${BARCODE}^FS
^XZ"

    sql = "SELECT INVOICE_DATE, INVOICE_DATE, INVOICE_NO, BILL_NB, PO_NO FROM BAR_INVHEAD WHERE BILL_NB = '#{bill_nb}'"
    conn = ActiveRecord::Base.connection()
    masters = conn.select_all(sql)
    
    if(masters && masters.size > 0)
      master = masters[0]
      cmd.gsub!("${INVOICE_DATE}", master["invoice_date"])
      cmd.gsub!("${INVOICE_NO}", master["invoice_no"])
      cmd.gsub!("${BILL_NB}", master["bill_nb"])
      cmd.gsub!("${PO_NO}", master["po_no"])
      cmd.gsub!("${BARCODE}", "#{master['bill_nb']}|#{master['invoice_no']}|#{master['po_no']}")
      debug_print cmd
      result = {:success => true, :id => bill_nb, :print_command => cmd}
    else
      result = {:success => false, :id => bill_nb}
    end
    
    respond_to do |format|
      format.xml  { render :xml => result }
      format.json { render :json => result }
    end    
  end
  
  def print_detail
  end
  
  def update_to_printed
    bill_nb = params[:id]
    
    begin
      conn = ActiveRecord::Base.connection()
      conn.execute("UPDATE BAR_INVHEAD SET PRN_YN = '1' WHERE BILL_NB = '#{bill_nb}'")
    rescue Exception => e
      raise Hatio::Exception::InvalidRequest, "ERROR : #{e.to_s}"
    end
    
    respond_to do |format|
      format.xml  { render :xml => {:success => true, :msg => :Success} }
      format.json { render :json => {:success => true, :msg => :Success} }
    end    
  end
  
end

class InstocksController < ProcedureResourcesController
  
  skip_before_filter :verify_authenticity_token
  
  public
  
  #
  # GET /domains/:domain_id/instocks/instock_info.json
  #    
  def instock_info
    inv_master = JSON.parse(params[:label_info])
    bill_nb, result = inv_master["bill_nb"], nil
    
    # GRHead에 존재하는지 체크 - 존재하면 vaildation error
    conn = ActiveRecord::Base.connection()
    check_sql = "SELECT COUNT(*) CNT FROM BAR_GRHEAD WHERE BILL_NB = '#{bill_nb}'"
    check_result = conn.select_all(check_sql)
    debug_print check_result[0]
    raise Hatio::Exception::InvalidRequest, "ERROR : Already processed!" if(check_result && check_result[0]["cnt"].to_i > 0)
    
    begin
      master_sql = "SELECT 
          TO_CHAR(TO_DATE(I.BILL_DT, 'YYYYMMDD'), 'YYYY-MM-DD') BILL_DT,
          TO_CHAR(TO_DATE(I.INVOICE_DATE, 'YYYYMMDD'), 'YYYY-MM-DD') INVOICE_DATE,
          I.TR_CD, S.DESCRIPTION TR_NM, I.INVOICE_NO, I.PO_NO
        FROM 
          BAR_INVHEAD I, SUPPLIERS S 
        WHERE 
          I.TR_CD = S.NAME AND
          I.BILL_NB = '#{bill_nb}'"
          
      detail_sql = "SELECT I.*, P.BOX_QTY, P.DESCRIPTION ITEM_NM FROM BAR_INVDETAIL I, PRODUCTS P WHERE I.BILL_NB = '#{bill_nb}' AND I.ITEM_CD = P.NAME"
      master = conn.select_all(master_sql)
      details = conn.select_all(detail_sql)
      
      if(master && master.size > 0)
        # master 정보가 테이블에 존재하면 
        master = master[0]
        inv_master["tr_cd"] = master["tr_cd"]
        inv_master["tr_nm"] = master["tr_nm"]
        inv_master["details"].each do |detail|
          item = details.find { |d| d["item_cd"] == detail["item_cd"] }
          if(item)
            detail["item_nm"] = item["item_nm"] 
            detail["lot_size"] = item["lot_size"] 
            detail["box_qty"] = item["box_qty"]
            detail["real_qt"] = 0
          end
        end
      
        result = { :master => inv_master, :success => true }
      else
        # master 정보가 테이블에 존재하지 않으면 INV 테이블에 Insert
        # TODO
      end
      
    rescue Exception => e
      raise Hatio::Exception::InvalidRequest, "ERROR : #{e.to_s}"
    end
    
    raise Hatio::Exception::InvalidRequest, "Invalid bill number [#{bill_nb}]" unless result
    
    respond_to do |format|
      format.xml  { render :xml => result }
      format.json { render :json => result }
      format.xls
    end
  end
  
  #
  # GET /domains/:domain_id/instocks/instock_detail_info.json
  #    
  def instock_detail_info
    bill_nb = params[:bill_nb]
    item_cd = params[:item_cd]
    scan_qty = params[:scan_qty]
    detail, conn = nil, ActiveRecord::Base.connection()
    
    begin
      inv_detail_sql = "SELECT 
          I.BILL_NB, I.SERIAL_NO ITEM_SERIAL, I.ITEM_CD, P.DESCRIPTION ITEM_NM, #{scan_qty} AS SCAN_QTY, #{scan_qty} AS REAL_QTY
        FROM 
          BAR_INVDETAIL I, PRODUCTS P
        WHERE 
          I.ITEM_CD = P.NAME AND
          I.BILL_NB = '#{bill_nb}'"
          
      details = conn.select_all(inv_detail_sql)
      if(details && details.size > 0)
        # master 정보가 테이블에 존재하면 
        detail = details[0]
        result = { :detail => detail, :success => true }
      else
        # master 정보가 테이블에 존재하지 않으면 ?
        # TODO
      end
      
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
  # POST /domains/:domain_id/instocks/update_multiple.json
  #  
  def update_multiple
    gr_master = JSON.parse(params[:multiple_data])
    detail_list = gr_master["details"]
    conn = ActiveRecord::Base.connection()
    today = Date.today.strftime('%Y%m%d')
    
    ActiveRecord::Base.transaction do
      detail_list.each do |detail|
        bill_dt = parse_date(gr_master["invoice_date"]).strftime('%Y%m%d')
        invoice_date = parse_date(gr_master["invoice_date"]).strftime('%Y%m%d')
                
        sql = "INSERT INTO
            BAR_GRHEAD (BILL_NB, TR_CD, BILL_DT, BASELOC_CD, LOC_CD, ITEM_CD, INVOICE_NO, PO_NO, IN_DT, PRICE, UNIT_PRICE, INVOICE_DATE, REG_ID, REG_DTM)
          VALUES (
            #{conn.quote(gr_master["bill_nb"])}, 
            #{conn.quote(gr_master["tr_cd"])}, 
            #{bill_dt}, 
            #{conn.quote(detail["baseloc_cd"])}, 
            #{conn.quote(detail["loc_cd"])}, 
            #{conn.quote(detail["item_cd"])}, 
            #{conn.quote(gr_master["invoice_no"])}, 
            #{conn.quote(gr_master["po_no"])}, 
            '#{today}', 
            #{detail["unit_price"] * detail["bill_qt"]}, 
            #{detail["unit_price"]}, 
            '#{invoice_date}', 
            #{conn.quote(current_user.id)},
            TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS'))"
        begin
          conn.execute(sql)
        rescue Exception => e
          raise Hatio::Exception::InvalidRequest, "ERROR : #{e.to_s}"
        end
      end
    end
    
    respond_to do |format|
      format.xml  { render :xml => {:success => true, :msg => :Success} }
      format.json { render :json => {:success => true, :msg => :Success} }
    end
  end
  
  #
  # GET /domains/:domain_id/instocks/:id/print_master.json
  #
  def print_master
  end
  
  #
  # GET /domains/:domain_id/instocks/:id/print_details.json
  #
  def print_details
  end  
end

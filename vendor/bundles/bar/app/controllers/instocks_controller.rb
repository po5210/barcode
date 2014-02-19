class InstocksController < ProcedureResourcesController
  
  skip_before_filter :verify_authenticity_token
  
  public
  
  #
  # GET /domains/:domain_id/instocks/instock_info.json
  #    
  def instock_info
    inv_master = JSON.parse(params[:invoice_info])
    bill_nb, result = inv_master["bill_nb"], nil
    
    # GRHead에 존재하는지 체크 - 존재하면 vaildation error
    conn = ActiveRecord::Base.connection()
    check_sql = "SELECT COUNT(*) CNT FROM BAR_GRHEAD WHERE BILL_NB = '#{bill_nb}'"
    check_result = conn.select_all(check_sql)
    #debug_print check_result[0]
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
      master = conn.select_all(master_sql)
          
      detail_sql = "SELECT I.*, P.BOX_QTY, P.DESCRIPTION ITEM_NM, P.BAR_LOCGRP_ID, P.BAR_LOCMAP_ID 
      						FROM BAR_INVDETAIL I, PRODUCTS P 
      					  WHERE I.BILL_NB = '#{bill_nb}' AND I.ITEM_CD = P.NAME"
      #detail_sql = "SELECT BOX_QTY, DESCRIPTION ITEM_NM FROM PRODUCTS  WHERE ITEM_CD = {}"
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
            detail["baseloc_cd"] = item["bar_locgrp_id"] 
            detail["loc_cd"] = item["bar_locmap_id"] 
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
    
    #raise Hatio::Exception::InvalidRequest, "Invalid bill number [#{bill_nb}]" unless result
    
    respond_to do |format|
      format.xml  { render :xml => result }
      format.json { render :json => result }
      format.xls
    end
  end
  
  #
  # GET /domains/:domain_id/instocks/instock_detail_info.json
  #    params : { bill_nb : billNb, item_cd : itemCd, item_serial : itemSerial, scan_qty : scanQty, bill_date : billDate },
  def instock_detail_info
    bill_nb = params[:bill_nb]
    item_cd = params[:item_cd]
    item_serial = params[:item_serial]
    scan_qty = params[:scan_qty]
    bill_date = params[:bill_date]
    detail, conn = nil, ActiveRecord::Base.connection()
    
    #debug_print params
    
    begin
      inv_detail_sql = "SELECT 
          I.BILL_NB, I.SERIAL_NO ITEM_SERIAL, I.ITEM_CD, P.DESCRIPTION ITEM_NM, BILL_QT AS SCAN_QTY, BILL_QT AS REAL_QTY
        FROM 
          BAR_INVDETAIL I, PRODUCTS P
        WHERE 
          I.ITEM_CD = P.NAME AND
          I.BILL_NB = '#{bill_nb}' AND I.ITEM_CD='#{item_cd}'"
          
      details = conn.select_all(inv_detail_sql)
      if(details && details.size > 0)
        # master 정보가 테이블에 존재하면 
        detail = details[0]
        
        #debug_print detail.inspect
       # if(detail["item_serial"]== item_serial && detail["scan_qty"].to_s==scan_qty.to_s)
        	result = { :detail => detail, :success => true }
       # else
       	#	result = {  :msg => "Invalid Label Info", :success => false }
       	#end
        
        
      else
        # master 정보가 테이블에 존재하지 않으면 ?
        # TODO bill_nb : billNb, item_cd : itemCd, serial_no : serialNo, bill_qty : billQty, bill_date : billDate
        
       item_sql = "SELECT P.DESCRIPTION ITEM_NM FROM PRODUCTS P WHERE P.NAME ='#{item_cd}'"        
        items = conn.select_all(item_sql)
      	if(items && items.size > 0)
      		item = items[0]
      		item_nm = item["item_nm"]
        	detail = {"bill_nb" => bill_nb, "item_cd" => item_cd, "item_serial" => item_serial, "bill_qty" => bill_qty, "item_nm" => item_nm }
        	result = { :detail => detail, :success => true }
      	else
      		result = { :msg => "Invalid Item", :success => false }
      	end
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
    instock_Info = JSON.parse(params[:instockInfo])
    masters = instock_Info["masters"]
    details = instock_Info["details"]
   
    #conn = ActiveRecord::Base.connection()
    today = Date.today.strftime('%Y%m%d')
    
    debug_print "instock_info => #{instock_info.inspect}"
    debug_print "masters => #{masters.inspect}"
    
    #ActiveRecord::Base.transaction do
      
      #debug_print details.inspect
      details.each do |detail|
        #bill_dt = parse_date(gr_master["invoice_date"]).strftime('%Y%m%d')
        #invoice_date = parse_date(gr_master["invoice_date"]).strftime('%Y%m%d')
                
        begin
	      plsql = get_plsql
	      r_bill_nb = plsql.SP_BAR_CTRL_BAR_GRDETAIL(
	        :arg_language     => 'en',
	        :arg_dateformat   => 'YYYY-MM-DD',
	        :arg_gubun   	=> 'I20',
	        :p_bill_nb        	=> instock_Info["bill_nb"],
	        :p_item_cd 		=> detail["item_cd"],
	        :p_item_sr          	=> detail["item_serial"],
	        :p_scan_qt        	=> detail["scan_qty"],
	        :p_real_qt         	=> detail["real_qty"],
	        :p_barcode_str       => detail["barcode_str"],
	        :rtn_cursor => rtn_cursor,
	      )[:rtn_cursor]
	      
		    rescue Exception => e
		      raise Hatio::Exception::InvalidRequest, "ERROR : #{e.to_s}"
			end
	  	end 
        
      
      masters.each do |master|
        in_dt = parse_date(instock_Info["in_dt"]).strftime('%Y%m%d')
        invoice_date = parse_date(instock_Info["invoice_date"]).strftime('%Y%m%d')
        price = master["unit_price"] * master["bill_qt"]
        
        begin
	      plsql = get_plsql
	      r_bill_nb = plsql.SP_BAR_CTRL_BAR_GRHEAD(
	        :arg_language     => 'en',
	        :arg_dateformat   => 'YYYY-MM-DD',
	        :arg_gubun   		=> 'I20',
	        :arg_bill_nb        		=> instock_Info["bill_nb"],
	        :arg_item_cd 			=> master["item_cd"],
	        :arg_baseloc_cd		=> master["baseloc_cd"],
	        :arg_loc_cd				=> master["loc_cd"],
	        :arg_invoice_no       	=> instock_Info["invoice_no"],
	        :arg_po_no       		=> instock_Info["po_no"],
	        :arg_bill_seq       		=> master["bill_seq"],
	        :arg_in_dt       			=> in_dt,
	        :arg_price       			=> price,
	        :arg_unit_price       	=> master["unit_price"],
	        :arg_lot_no       		=> instock_Info["bill_dt"],
	        :arg_tr_cd       			=> instock_Info["tr_cd"],
	        :arg_scan_qty        	=> master["real_qt"],
	        :arg_bill_dt         		=> instock_Info["bill_dt"],
	        :arg_arrival_qty       	=> master["bill_qt"],
	        :arg_user_id       	=> current_user.id,
	        :arg_invoice_date       	=> invoice_date,
	        :rtn_cursor 			=> rtn_cursor,
	      )[:rtn_cursor]
	      
		    rescue Exception => e
		      raise Hatio::Exception::InvalidRequest, "ERROR : #{e.to_s}"
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

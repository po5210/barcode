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
          
      detail_sql = "SELECT I.*, P.BOX_QTY, P.DESCRIPTION ITEM_NM, P.BAR_LOCGRP_ID, P.BAR_LOCMAP_ID 
      						FROM BAR_INVDETAIL I, PRODUCTS P 
      					  WHERE I.BILL_NB = '#{bill_nb}' AND I.ITEM_CD = P.NAME"
      #detail_sql = "SELECT BOX_QTY, DESCRIPTION ITEM_NM FROM PRODUCTS  WHERE ITEM_CD = {}"
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
    
    raise Hatio::Exception::InvalidRequest, "Invalid bill number [#{bill_nb}]" unless result
    
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
        if(detail["item_serial"]== item_serial && detail["scan_qty"].to_s==scan_qty.to_s)
        	result = { :detail => detail, :success => true }
        else
       		result = {  :msg => "Invalid Label Info", :success => false }
       	end
        
        
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
   
    conn = ActiveRecord::Base.connection()
    today = Date.today.strftime('%Y%m%d')
    
    #debug_print "instock_info => #{instock_info.inspect}"
    #debug_print "masters => #{masters.inspect}"
    
    ActiveRecord::Base.transaction do
      masters.each do |master|
        in_dt = parse_date(instock_Info["in_dt"]).strftime('%Y%m%d')
        invoice_date = parse_date(instock_Info["invoice_date"]).strftime('%Y%m%d')
        
        
        master_sql = "INSERT INTO BAR_GRHEAD (
            	BILL_NB, 			TR_CD, 			BILL_DT, 				BASELOC_CD, 	
            	LOC_CD, 			ITEM_CD, 			ARRIVAL_QTY,		INVOICE_NO, 	
            	PO_NO, 			BILL_SEQ,		IN_DT, 					PRICE, 
            	UNIT_PRICE, 	SCAN_QTY,		INVOICE_DATE, 	REG_ID, 	REG_DTM
          ) VALUES (
         	 #{conn.quote(instock_Info["bill_nb"])}
            ,#{conn.quote(instock_Info["tr_cd"])} 
            ,#{conn.quote(instock_Info["bill_dt"])}
            ,#{conn.quote(master["baseloc_cd"])}
            ,#{conn.quote(master["loc_cd"])}
            ,#{conn.quote(master["item_cd"])} 
            ,#{master["bill_qt"]}
            ,#{conn.quote(instock_Info["invoice_no"])} 
            ,#{conn.quote(instock_Info["po_no"])} 
            ,#{conn.quote(master["bill_seq"])}
            ,#{conn.quote(in_dt)}
            ,#{master["unit_price"] * master["bill_qt"]}
            ,#{master["unit_price"]}
            ,#{master["real_qt"]}
            ,'#{invoice_date}'
            ,#{conn.quote(current_user.id)}
            ,TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS'))"
            
        #debug_print master_sql
        
        begin
          conn.execute(master_sql)
        rescue Exception => e
          raise Hatio::Exception::InvalidRequest, "ERROR : #{e.to_s}"
        end
      end
      
      
      debug_print details.inspect
      details.each do |detail|
        #bill_dt = parse_date(gr_master["invoice_date"]).strftime('%Y%m%d')
        #invoice_date = parse_date(gr_master["invoice_date"]).strftime('%Y%m%d')
                
        detail_sql = "INSERT INTO BAR_GRDETAIL (
        			BILL_NB, 		ITEM_CD, 				ITEM_SERIAL, 	SCAN_QTY, 
        			REAL_QTY, 	BARCODE_STR, 	REG_ID, 			REG_DTM
        ) VALUES (
            #{conn.quote(instock_Info["bill_nb"])}, 
            #{conn.quote(detail["item_cd"])}, 
            #{conn.quote(detail["item_serial"])}, 
            #{detail["scan_qty"]}, 
            #{detail["real_qty"]}, 
            #{conn.quote(detail["barcode_str"])}, 
            #{conn.quote(current_user.id)},
            TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS'))"
            
        debug_print "BAR_GRDETAIL => #{detail_sql}"
          
        begin
          conn.execute(detail_sql)
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

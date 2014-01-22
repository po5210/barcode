puts "Loading [1400_create_selections] file..."

puts "Custom Selection creating..."

domain = Domain.system_domain
admin = User.find_by_login('admin')
User.current_user = admin

# 바코드 품목 조회 (public/bundle/bar/view/InvoiceSearch.js에서 품목 (item_cd) 조회시 사용)
BarItemsSelection = DiySelection.setup domain, :SelectBarItems, {:script_type => 'DSL', :view_type => 'LIST'} do
  @count_logic = '100'
  @service_logic = <<-EOS
  tr_cd_eq = params["tr_cd"]
  query_params = params["_q"]
  name_like = query_params["name-like"] unless(query_params["name-like"].blank?)
  name_like = "UPPER('%\#{name_like}%')" if(name_like)

  if(tr_cd_eq)
      conn = ActiveRecord::Base.connection
      tr_cd_eq = conn.quote(tr_cd_eq)

      data_sql = "
        SELECT 
          B.NAME ID,
          B.NAME,
          NVL(B.DESCRIPTION, '') DESCRIPTION,   
          NVL(B.ITEM_TP, '') ITEM_TP,        
          NVL(B.UNIT, '') UNIT, 
          NVL(A.LABEL_PRINT_FG, '1') LABEL_PRINT_FG,      
          NVL(A.BOX_QTY, 0) BOX_QTY,        
          --NVL(A.PALLET_QTY,0) DEFAULT_QTY,
          NVL(B.DEFAULT_QTY,0) DEFAULT_QTY,
          NVL(A.CKDBOX_QTY, 0) CKDBOX_QTY
        FROM 
          BAR_MATMAP A, PRODUCTS B
        WHERE 
          A.TR_CD = \#{tr_cd_eq} AND A.ITEM_CD = B.NAME"

      count_sql = "SELECT 
          COUNT(*) CNT
        FROM 
          BAR_MATMAP A, PRODUCTS B
        WHERE 
          A.TR_CD = \#{tr_cd_eq} AND A.ITEM_CD = B.NAME"

      data_sql << " AND UPPER(A.ITEM_CD) LIKE \#{name_like}" if(name_like)
      count_sql << " AND UPPER(A.ITEM_CD) LIKE \#{name_like}" if(name_like)

      count_result = conn.select_all(count_sql)
      data_results = conn.select_all(data_sql)
  else
      count_result = 0
      data_results = []
  end

  results = {
      :items => data_results,
      :total_count => count_result[0]["cnt"],
      :success => true
  }

  results
  EOS
end

# 바코드 품목 조회 (public/bundle/bar/view/InvoiceSearch.js에서 거래명서서 번호 (bill_nb) 조회시 사용)
BarBillNbsSelection = DiySelection.setup domain, :SelectBarBillNbs, {:script_type => 'DSL', :view_type => 'LIST'} do
  @count_logic = '100'
  @service_logic = <<-EOS
  query_params = params["_q"]
  name_like = query_params["name-like"] unless(query_params["name-like"].blank?)
  name_like = "UPPER('%\#{name_like}%')" if(name_like)

  bill_dt = params["bill_dt"] unless(params["bill_dt"].blank?)
  bill_dt = parse_date(bill_dt).strftime("%Y%m%d")
  tr_cd = params["tr_cd"] unless(params["tr_cd"].blank?)

  if(bill_dt && tr_cd)
      conn = ActiveRecord::Base.connection
      tr_cd = conn.quote(tr_cd)
      bill_dt = conn.quote(bill_dt)

      data_sql = "SELECT BILL_NB ID, BILL_NB NAME, TR_CD DESCRIPTION FROM  BAR_INVHEAD WHERE  BILL_DT = \#{bill_dt} AND TR_CD = \#{tr_cd}"
      data_results = conn.select_all(data_sql)
  else
      data_results = []
  end

  results = {
      :items => data_results,
      :total_count => data_results.size,
      :success => true
  }

  results
  EOS
end

#
# Barcode System Report
#
DiySelection.setup domain, :GrByMat, {:script_type => 'DSL', :view_type => 'LIST'} do
  @count_logic = '100'
  @service_logic = <<-EOS
  domain = self.domain
  from_date = params['date-gte'] unless(params['date-gte'].blank?)
  to_date = params['date-lte'] unless(params['date-lte'].blank?)
  supplier = params['supplier.name-eq'] unless(params['supplier.name-eq'].blank?)
  loc_cd = params['loc_cd'] unless(params['loc_cd'].blank?)
  item_code = params['item_cd_id'] unless(params['item_cd_id'].blank?)
  invoice_no = params['invoice_no'] unless(params['invoice_no'].blank?)
  po_no = params['po_no'] unless(params['po_no'].blank?)
  internal_1 = params['internal_1'] unless(params['internal_1'].blank?)
  internal_2 = params['internal_2'] unless(params['internal_2'].blank?)
  internal_3 = params['internal_3'] unless(params['internal_3'].blank?)

  page = (params[:page] || 1).to_i
  limit = (params[:limit] || 30).to_i
  end_offset = page * limit
  start_offset = end_offset - (limit - 1)

  conditions = "A.ITEM_CD = B.NAME AND A.BASELOC_CD = C.BASELOC_CD AND (A.BASELOC_CD = D.BASELOC_CD AND A.LOC_CD = D.LOC_CD) AND A.TR_CD = E.NAME AND A.in_dt BETWEEN to_char(to_date('\#{from_date}', 'yyyy-mm-dd'), 'yyyymmdd') AND to_char(to_date('\#{to_date}', 'yyyy-mm-dd'), 'yyyymmdd')"

  if(supplier)
    conditions << " AND A.TR_CD LIKE NVL('\#{supplier}', '' ) || '%'"
  end
  if(loc_cd)
    conditions << " AND A.LOC_CD LIKE NVL('\#{loc_cd}', '' ) || '%'"
  end
  if(item_code)
    rm_code = domain.products.find(item_code)
    conditions << " AND A.ITEM_CD LIKE NVL('\#{rm_code.name}', '' ) || '%'"
  end
  if(invoice_no)
    conditions << " AND A.INVOICE_NO LIKE '%' || NVL('\#{invoice_no}', '') || '%'"
  end
  if(po_no)
    conditions << " AND A.PO_NO LIKE  '%' || NVL('\#{po_no}', '') || '%'"
  end
  if(internal_1)
    conditions << " AND SUBSTR(A.BILL_NB, 1, 7) LIKE '%' || NVL('\#{internal_1}', '') || '%'"
  end
  if(internal_2)
    conditions << " AND SUBSTR(A.BILL_NB, 8, 8) LIKE '%' || NVL('\#{internal_2}', '') || '%'"
  end
  if(internal_3)
    conditions << " AND SUBSTR(A.BILL_NB, 16, 3) LIKE '%' || NVL('\#{internal_3}', '') || '%'"
  end


  sql = "select * from(select raw_sql_.*, rownum raw_rnum_ from(SELECT    
                       -- FN_BAR_DATECONVERT('YYYY-MM-DD', 'C02', A.in_dt) AS BILL_DT,
                       TO_CHAR(TO_DATE(A.in_dt, 'YYYY-MM-DD'), 'DD/MM/YY') AS BILL_DT,
                       A.BILL_NB,
                       A.TR_CD || ' : ' || E.DESCRIPTION AS TR_CD,
                       A.INVOICE_NO,
                       A.PO_NO,
                       B.NAME AS ITEM_CD,
                       B.DESCRIPTION AS ITEM_NM,
                       B.ITEM_TP,
                       A.BASELOC_CD || ' : ' || C.BASELOC_NM AS BASELOC_CD, 
                       A.LOC_CD || ' : ' || D.loc_nm as loc_cd,
                       ( CASE WHEN B.LABEL_PRINT_FG = '1' THEN B.DEFAULT_QTY WHEN B.LABEL_PRINT_FG = '2' THEN B.PALLET_QTY ELSE B.CKDBOX_QTY END ) AS LOT_SIZE,
                       A.BOX_QTY AS BOX_QTY,
                       A.LOT_RQTY AS IN_QTY
                FROM (  SELECT  B.in_dt, b.tr_cd, B.ITEM_CD, b.baseloc_cd, b.loc_cd, A.BILL_NB, SUM(a.real_qty) AS LOT_RQTY, COUNT(*) AS BOX_QTY, B.INVOICE_NO, B.PO_NO      
                          FROM BAR_GRDETAIL A, BAR_GRHEAD B
                         WHERE A.bill_nb = b.bill_nb and a.item_cd = b.item_cd
                          GROUP BY B.in_dt, b.tr_cd, B.ITEM_CD, b.baseloc_cd , b.loc_cd, A.BILL_NB, B.INVOICE_NO, B.PO_NO ) A,
                      PRODUCTS B, BAR_LOCGRP C, BAR_LOCMAP D, SUPPLIERS E
               WHERE \#{conditions} 
               ORDER BY A.in_dt, A.TR_CD, A.INVOICE_NO,A.ITEM_CD, A.BASELOC_CD, A.LOC_CD) raw_sql_ ) where raw_rnum_ between \#{start_offset} and \#{end_offset}"

  count_sql = "SELECT    count(*) count
                FROM (  SELECT  B.in_dt, b.tr_cd, B.ITEM_CD, b.baseloc_cd, b.loc_cd, A.BILL_NB, SUM(a.real_qty) AS LOT_RQTY, COUNT(*) AS BOX_QTY, B.INVOICE_NO, B.PO_NO      
                          FROM BAR_GRDETAIL A, BAR_GRHEAD B
                         WHERE A.bill_nb = b.bill_nb and a.item_cd = b.item_cd
                          GROUP BY B.in_dt, b.tr_cd, B.ITEM_CD, b.baseloc_cd , b.loc_cd, A.BILL_NB, B.INVOICE_NO, B.PO_NO ) A,
                      PRODUCTS B, BAR_LOCGRP C, BAR_LOCMAP D, SUPPLIERS E
               WHERE \#{conditions} 
               ORDER BY A.in_dt, A.TR_CD, A.INVOICE_NO,A.ITEM_CD, A.BASELOC_CD, A.LOC_CD"

  results = DiySelection.connection.select_all(sql)
  result_counts = DiySelection.connection.select_all(count_sql)

  {"items" => results, "success" => true, "total" => result_counts[0]['count']}
  EOS
  
  in_params 'date-gte'
  in_params 'date-lte'
  in_params 'supplier.name-eq'
  in_params 'loc_cd'
  in_params 'item_cd_id'
  in_params 'invoice_no'
  in_params 'po_no'
  in_params 'internal_1'
  in_params 'internal_2'
  in_params 'internal_3'
  
  out_params :bill_dt
  out_params :bill_nb
  out_params :tr_cd
  out_params :invoice_no
  out_params :po_no
  out_params :item_cd
  out_params :item_nm
  out_params :item_tp
  out_params :baseloc_cd
  out_params :loc_cd
  out_params :lot_size
  out_params :box_qty
  out_params :in_qty
end

#
# Barcode System Report
#
DiySelection.setup domain, :GrBySer, {:script_type => 'DSL', :view_type => 'LIST'} do
  @count_logic = '100'
  @service_logic = <<-EOS
  domain = self.domain
  from_date = params['date-gte'] unless(params['date-gte'].blank?)
  to_date = params['date-lte'] unless(params['date-lte'].blank?)
  supplier = params['supplier.name-eq'] unless(params['supplier.name-eq'].blank?)
  loc = params['loc'] unless(params['loc'].blank?)
  part_no = params['item_cd_id'] unless(params['item_cd_id'].blank?)
  invoice_no = params['invoice_no'] unless(params['invoice_no'].blank?)
  po_no = params['po_no'] unless(params['po_no'].blank?)
  internal_1 = params['internal_1'] unless(params['internal_1'].blank?)
  internal_2 = params['internal_2'] unless(params['internal_2'].blank?)
  internal_3 = params['internal_3'] unless(params['internal_3'].blank?)
  lot_no = params['lot_no'] unless(params['lot_no'].blank?)
  serial_no = params['serial_no'] unless(params['serial_no'].blank?)

  page = (params[:page] || 1).to_i
  limit = (params[:limit] || 30).to_i
  end_offset = page * limit
  start_offset = end_offset - (limit - 1)

  conditions = "a.bill_nb = b.bill_nb and a.item_cd = b.item_cd
     and a.item_cd = c.name
     and b.baseloc_cd = d.baseloc_cd
     and b.baseloc_cd = e.baseloc_cd and b.loc_cd = e.loc_cd
     AND A.BARCODE_STR = G.BARCODE
     AND A.BARCODE_STR = H.BARCODE AND H.BARCODE_SQ = '1'
     AND B.TR_CD = F.name(+)
     AND B.IN_DT BETWEEN to_char(to_date('\#{from_date}', 'yyyy-mm-dd'), 'yyyymmdd') AND to_char(to_date('\#{to_date}', 'yyyy-mm-dd'), 'yyyymmdd')"

  if(supplier)
    conditions << " AND B.TR_CD LIKE NVL('\#{supplier}', '') || '%'"
  end
  if(loc)
    conditions << " AND B.LOC_CD LIkE NVL('\#{loc}', '') || '%'"
  end
  if(part_no)
    rm_code = domain.products.find(part_no)
    conditions << " AND A.ITEM_CD LIKE NVL('\#{rm_code.name}', '' ) || '%'"
  end
  if(invoice_no)
    conditions << " AND B.INVOICE_NO LIKE '%' || NVL('\#{invoice_no}', '') || '%'"
  end
  if(po_no)
    conditions << " AND B.PO_NO LIKE  '%' || NVL('\#{po_no}', '') || '%'"
  end
  if(internal_1)
    conditions << " AND SUBSTR(B.BILL_NB, 1, 7) LIKE '%' || NVL('\#{internal_1}', '') || '%'"
  end
  if(internal_2)
    conditions << " AND SUBSTR(B.BILL_NB, 8, 8) LIKE '%' || NVL('\#{internal_2}', '') || '%'"
  end
  if(internal_3)
    conditions << " AND SUBSTR(B.BILL_NB, 16, 3) LIKE '%' || NVL('\#{internal_3}', '') || '%'"
  end
  if(lot_no)
    conditions << " AND G.LOT_NO LIKE  NVL('\#{lot_no}', '') || '%'"
  end
  if(serial_no)
    conditions << " AND A.ITEM_SERIAL LIKE  NVL('\#{serial_no}', '') || '%'"
  end



  sql = "select * from(select raw_sql_.*, rownum raw_rnum_ from(select
                      -- FN_BAR_DATECONVERT('YYYY-MM-DD', 'C02', b.in_dt) AS WH_DT
                      TO_CHAR(TO_DATE(b.in_dt, 'YYYY-MM-DD'), 'DD/MM/YY') AS WH_DT
                     , A.BILL_NB
                     , b.tr_cd  || ' : ' || F.DESCRIPTION AS TR_CD
                     , B.INVOICE_NO AS INVOICE_NO
                     , B.PO_NO AS PO_NO
                     , a.item_cd
                     , c.DESCRIPTION AS item_nm
                     , c.item_tp
                     , SUBSTR(A.BARCODE_STR, 1, INSTR(A.BARCODE_STR, '|') - 1) AS INTERNAL
                     --, ( CASE WHEN c.LABEL_PRINT_FG = '1' THEN c.BOX_QTY WHEN c.LABEL_PRINT_FG = '2' THEN c.PALLET_QTY ELSE c.CKDBOX_QTY END ) AS LOT_SIZE
                     , G.object AS OBJECTS
                     , G.lot_no AS LOT_NO
                     , G.serial_no AS SERIAL
                     , G.LOT_QTY AS LOT_SIZE
                     , a.real_qty AS LOT_RQTY
                     , b.baseloc_cd || ' : ' || d.baseloc_nm as baseloc_cd
                     , b.loc_cd || ' : ' || e.loc_nm as loc_cd
                     , TO_CHAR(TO_DATE(H.REG_DTM, 'YYYY-MM-DD HH24:MI:SS'), 'YYYY-MM-DD HH24:MI:SS') AS REG_DTM
                from BAR_GRDETAIL a , BAR_GRHEAD b, PRODUCTS c, BAR_LOCGRP d, BAR_LOCMAP e, SUPPLIERS F, BAR_BARMST G, BAR_BARHIST H
               where \#{conditions}
                 ORDER BY b.in_dt, b.tr_cd, B.INVOICE_NO,  a.item_cd, b.baseloc_cd , b.loc_cd) raw_sql_ ) where raw_rnum_ between \#{start_offset} and \#{end_offset}"

  count_sql = "select count(*) count
                from BAR_GRDETAIL a , BAR_GRHEAD b, PRODUCTS c, BAR_LOCGRP d, BAR_LOCMAP e, SUPPLIERS F, BAR_BARMST G, BAR_BARHIST H
                where \#{conditions}
                ORDER BY b.in_dt, b.tr_cd, B.INVOICE_NO,  a.item_cd, b.baseloc_cd , b.loc_cd"

  results = DiySelection.connection.select_all(sql)
  result_counts = DiySelection.connection.select_all(count_sql)

  {"items" => results, "success" => true, "total" => result_counts[0]['count']}
  EOS
  
  in_params 'date-gte'
  in_params 'date-lte'
  in_params 'supplier.name-eq'
  in_params 'loc'
  in_params 'item_cd_id'
  in_params 'invoice_no'
  in_params 'po_no'
  in_params 'internal_1'
  in_params 'internal_2'
  in_params 'internal_3'
  in_params 'lot_no'
  in_params 'serial_no'
  
  out_params :wh_dt
  out_params :bill_nb
  out_params :tr_cd
  out_params :invoice_no
  out_params :po_no
  out_params :item_cd
  out_params :item_nm
  out_params :item_tp
  out_params :internal
  out_params :objects
  out_params :lot_no
  out_params :serial
  out_params :lot_size
  out_params :lot_rqty
  out_params :baseloc_cd
  out_params :loc_cd
  out_params :reg_dtm
end

#
# Barcode System Report
#
DiySelection.setup domain, :GiBySer, {:script_type => 'DSL', :view_type => 'LIST'} do
  @count_logic = '100'
  @service_logic = <<-EOS
  from_date = params['date-gte'] unless(params['date-gte'].blank?)
  to_date = params['date-lte'] unless(params['date-lte'].blank?)
  item_cd = params['item_cd'] unless(params['item_cd'].blank?)
  loc_cd = params['loc_cd'] unless(params['loc_cd'].blank?)
  t_loc_cd = params['t_loc_cd'] unless(params['t_loc_cd'].blank?)
  lot_no = params['lot_no'] unless(params['lot_no'].blank?)
  serial = params['serial'] unless(params['serial'].blank?)

  page = (params[:page] || 1).to_i
  limit = (params[:limit] || 30).to_i
  end_offset = page * limit
  start_offset = end_offset - (limit - 1)

  conditions = "A.WHI_DT BETWEEN to_char(to_date('\#{from_date}', 'yyyy-mm-dd'), 'yyyymmdd') AND to_char(to_date('\#{to_date}', 'yyyy-mm-dd'), 'yyyymmdd')"

  conditions << " AND A.ITEM_CD LIKE '\#{item_cd}%'" if(item_cd)

  conditions << " AND A.LOC_CD LIKE '\#{loc_cd}%' " if(loc_cd)

  conditions << " AND A.OUTLOC_CD LIKE '\#{t_loc_cd}%' " if(t_loc_cd)

  conditions << " AND H.LOT_NO LIKE '\#{lot_no}%' " if(lot_no)

  conditions << " AND H.SERIAL_NO LIKE '\#{serial}%' " if(serial)

  sql = "select * from(select raw_sql_.*, rownum raw_rnum_ from(SELECT WHI_DT
                     , ITEM_CD
                     , ITEM_NM
                     , INTERNAL
                     , OBJECT
                     , LOT_NO
                     , SERIAL
                     , LOT_SIZE
                     , LOT_RQTY
                     , LOC_CD
                     , LOC_NM
                     , OUTLOC_CD
                     , OUTLOC_NM
                     , REG_DTM
                FROM (       
                      SELECT 
                             -- FN_BAR_DATECONVERT('YYYY-MM-DD', 'C02', WHI_DT) AS WHI_DT,
                             TO_CHAR(TO_DATE(WHI_DT, 'YYYY-MM-DD'), 'DD/MM/YY') AS WHI_DT,
                             A.ITEM_CD,
                             B.DESCRIPTION AS ITEM_NM,
                             B.ITEM_TP,
                             A.LOT_QTY AS LOT_SIZE, 
                             A.LOT_RQTY,
                             A.BASELOC_CD || ' : ' || E.BASELOC_NM AS BASELOC_CD,
                             A.LOC_CD,
                             F.LOC_NM AS LOC_NM,
                             A.OUTBASELOC_CD  || ' : ' || C.BASELOC_NM AS OUTBASELOC_CD,
                             A.OUTLOC_CD,
                             D.LOC_NM AS OUTLOC_NM,  
                             SUBSTR(A.BARCODE, 1, INSTR(A.BARCODE, '|') - 1) AS INTERNAL,
                             H.object, 
                             H.lot_no,
                             H.serial_no AS SERIAL,
                             TO_CHAR(TO_DATE(A.REG_DTM, 'YYYY-MM-DD HH24:MI:SS'), 'YYYY-MM-DD HH24:MI:SS') AS REG_DTM
                        FROM BAR_MATOUT A
                             LEFT JOIN PRODUCTS B ON A.ITEM_CD = B.NAME
                             LEFT JOIN BAR_LOCGRP C ON A.OUTBASELOC_CD = C.BASELOC_CD       
                             LEFT JOIN BAR_LOCMAP D ON A.OUTLOC_CD = D.LOC_CD AND A.OUTBASELOC_CD = D.BASELOC_CD
                             LEFT JOIN BAR_LOCGRP E ON A.BASELOC_CD = E.BASELOC_CD
                             LEFT JOIN BAR_LOCMAP F ON A.LOC_CD = F.LOC_CD AND A.BASELOC_CD = F.BASELOC_CD
                             LEFT JOIN BAR_CODEMST G ON A.LOT_FG = G.COMM_CD AND G.COMM_FG = '87'
                             JOIN BAR_BARMST H ON A.BARCODE = H.BARCODE
                       WHERE \#{conditions}
                      )
               ORDER BY WHI_DT, ITEM_CD, SERIAL, BASELOC_CD, LOC_CD, OUTBASELOC_CD, OUTLOC_CD) raw_sql_ ) where raw_rnum_ between \#{start_offset} and \#{end_offset}"

  count_sql = "SELECT count(*) count
                FROM (       
                      SELECT 
                            FN_BAR_DATECONVERT('YYYY-MM-DD', 'C02', WHI_DT) AS WHI_DT,
                             A.ITEM_CD,
                             B.DESCRIPTION AS ITEM_NM,
                             B.ITEM_TP,
                             A.LOT_QTY AS LOT_SIZE, 
                             A.LOT_RQTY,
                             A.BASELOC_CD || ' : ' || E.BASELOC_NM AS BASELOC_CD,
                             A.LOC_CD,
                             F.LOC_NM AS LOC_NM,
                             A.OUTBASELOC_CD  || ' : ' || C.BASELOC_NM AS OUTBASELOC_CD,
                             A.OUTLOC_CD,
                             D.LOC_NM AS OUTLOC_NM,  
                             SUBSTR(A.BARCODE, 1, INSTR(A.BARCODE, '|') - 1) AS INTERNAL,
                             H.object, 
                             H.lot_no,
                             H.serial_no AS SERIAL,
                             TO_CHAR(TO_DATE(A.REG_DTM, 'YYYY-MM-DD HH24:MI:SS'), 'YYYY-MM-DD HH24:MI:SS') AS REG_DTM
                        FROM BAR_MATOUT A
                             LEFT JOIN PRODUCTS B ON A.ITEM_CD = B.NAME
                             LEFT JOIN BAR_LOCGRP C ON A.OUTBASELOC_CD = C.BASELOC_CD       
                             LEFT JOIN BAR_LOCMAP D ON A.OUTLOC_CD = D.LOC_CD AND A.OUTBASELOC_CD = D.BASELOC_CD
                             LEFT JOIN BAR_LOCGRP E ON A.BASELOC_CD = E.BASELOC_CD
                             LEFT JOIN BAR_LOCMAP F ON A.LOC_CD = F.LOC_CD AND A.BASELOC_CD = F.BASELOC_CD
                             LEFT JOIN BAR_CODEMST G ON A.LOT_FG = G.COMM_CD AND G.COMM_FG = '87'
                             JOIN BAR_BARMST H ON A.BARCODE = H.BARCODE
                       WHERE \#{conditions}
                      )
               ORDER BY WHI_DT, ITEM_CD, SERIAL, BASELOC_CD, LOC_CD, OUTBASELOC_CD, OUTLOC_CD"

  results = DiySelection.connection.select_all(sql)
  result_counts = DiySelection.connection.select_all(count_sql)

  {"items" => results, "success" => true, "total" => result_counts[0]['count']}
  EOS
  
  in_params 'date-gte'
  in_params 'date-lte'
  in_params 'item_cd'
  in_params 'loc_cd'
  in_params 't_loc_cd'
  in_params 'lot_no'
  in_params 'serial'
  
  out_params :whi_dt
  out_params :item_cd
  out_params :item_nm
  out_params :internal
  out_params :serial
  out_params :lot_size
  out_params :lot_rqty
  out_params :loc_nm
  out_params :loc_cd
  out_params :outloc_nm
  out_params :outloc_cd
  out_params :reg_dtm
  out_params :object
  out_params :lot_no
end

#
# Barcode System Report
#
DiySelection.setup domain, :GiByMat, {:script_type => 'DSL', :view_type => 'LIST'} do
  @count_logic = '100'
  @service_logic = <<-EOS
  from_date = params['date-gte'] unless(params['date-gte'].blank?)
  to_date = params['date-lte'] unless(params['date-lte'].blank?)
  item_cd = params['item_cd'] unless(params['item_cd'].blank?)
  loc_cd = params['loc_cd'] unless(params['loc_cd'].blank?)
  t_loc_cd = params['t_loc_cd'] unless(params['t_loc_cd'].blank?)

  page = (params[:page] || 1).to_i
  limit = (params[:limit] || 30).to_i
  end_offset = page * limit
  start_offset = end_offset - (limit - 1)

  conditions = "A.WHI_DT BETWEEN to_char(to_date('\#{from_date}', 'yyyy-mm-dd'), 'yyyymmdd') AND to_char(to_date('\#{to_date}', 'yyyy-mm-dd'), 'yyyymmdd')"

  conditions << " AND A.ITEM_CD LIKE '\#{item_cd}%'" if(item_cd)

  conditions << " AND A.LOC_CD LIKE '\#{loc_cd}%' " if(loc_cd)

  conditions << " AND A.OUTLOC_CD LIKE '\#{t_loc_cd}%' " if(t_loc_cd)

  sql = "select * from(select raw_sql_.*, rownum raw_rnum_ from(SELECT
                     -- FN_BAR_DATECONVERT('YYYY-MM-DD', 'C02', WIN.WHI_DT) AS WHI_DT,
                     TO_CHAR(TO_DATE(WHI_DT, 'YYYY-MM-DD'), 'DD/MM/YY') AS WHI_DT,
                     WIN.ITEM_CD, 
                     A.DESCRIPTION AS ITEM_NM,
                     A.ITEM_TP,
                     CASE WHEN A.LABEL_PRINT_FG = '1' THEN A.DEFAULT_QTY 
                                  WHEN A.LABEL_PRINT_FG = '2' THEN A.PALLET_QTY 
                                  WHEN A.LABEL_PRINT_FG = '3' THEN A.CKDBOX_QTY
                                  ELSE 0 END AS LOT_SIZE,
                     WIN.BOX_QTY,
                     WIN.LOT_RQTY,
                     WIN.BASELOC_CD || ' : ' || D.BASELOC_NM AS BASELOC_CD,
                     WIN.LOC_CD || ' : ' || E.LOC_NM AS LOC_CD,
                     WIN.OUTBASELOC_CD  || ' : ' || B.BASELOC_NM AS OUTBASELOC_CD,
                     WIN.OUTLOC_CD || ' : ' || C.LOC_NM AS OUTLOC_CD       
                FROM (  SELECT A.WHI_DT, A.LOT_FG, A.ITEM_CD, A.BASELOC_CD, A.LOC_CD, A.OUTBASELOC_CD, A.OUTLOC_CD, SUM(A.LOT_RQTY) AS LOT_RQTY, COUNT(*) AS BOX_QTY
                          FROM BAR_MATOUT A
                         WHERE \#{conditions}
                         GROUP BY A.WHI_DT,  A.LOT_FG, A.ITEM_CD, A.OUTBASELOC_CD, A.OUTLOC_CD, A.BASELOC_CD, A.LOC_CD ) WIN
                     LEFT JOIN PRODUCTS A ON WIN.ITEM_CD = A.NAME
                     LEFT JOIN BAR_LOCGRP B ON WIN.OUTBASELOC_CD = B.BASELOC_CD
                     LEFT JOIN BAR_LOCMAP C ON WIN.OUTLOC_CD = C.LOC_CD AND WIN.OUTBASELOC_CD = C.BASELOC_CD
                     LEFT JOIN BAR_LOCGRP D ON WIN.BASELOC_CD = D.BASELOC_CD
                     LEFT JOIN BAR_LOCMAP E ON WIN.LOC_CD = E.LOC_CD AND WIN.BASELOC_CD = E.BASELOC_CD
                     LEFT JOIN BAR_CODEMST F ON WIN.LOT_FG = F.COMM_CD AND F.COMM_FG = '87'
              ORDER BY WIN.WHI_DT, WIN.ITEM_CD, WIN.OUTBASELOC_CD, WIN.OUTLOC_CD) raw_sql_ ) where raw_rnum_ between \#{start_offset} and \#{end_offset}"

  count_sql = "SELECT count(*) count       
                FROM (  SELECT A.WHI_DT, A.LOT_FG, A.ITEM_CD, A.BASELOC_CD, A.LOC_CD, A.OUTBASELOC_CD, A.OUTLOC_CD, SUM(A.LOT_RQTY) AS LOT_RQTY, COUNT(*) AS BOX_QTY
                          FROM BAR_MATOUT A
                         WHERE \#{conditions}
                         GROUP BY A.WHI_DT,  A.LOT_FG, A.ITEM_CD, A.OUTBASELOC_CD, A.OUTLOC_CD, A.BASELOC_CD, A.LOC_CD ) WIN
                     LEFT JOIN PRODUCTS A ON WIN.ITEM_CD = A.NAME
                     LEFT JOIN BAR_LOCGRP B ON WIN.OUTBASELOC_CD = B.BASELOC_CD
                     LEFT JOIN BAR_LOCMAP C ON WIN.OUTLOC_CD = C.LOC_CD AND WIN.OUTBASELOC_CD = C.BASELOC_CD
                     LEFT JOIN BAR_LOCGRP D ON WIN.BASELOC_CD = D.BASELOC_CD
                     LEFT JOIN BAR_LOCMAP E ON WIN.LOC_CD = E.LOC_CD AND WIN.BASELOC_CD = E.BASELOC_CD
                     LEFT JOIN BAR_CODEMST F ON WIN.LOT_FG = F.COMM_CD AND F.COMM_FG = '87'
              ORDER BY WIN.WHI_DT, WIN.ITEM_CD, WIN.OUTBASELOC_CD, WIN.OUTLOC_CD"


  results = DiySelection.connection.select_all(sql)
  result_counts = DiySelection.connection.select_all(count_sql)

  {"items" => results, "success" => true, "total" => result_counts[0]['count']}
  EOS
  
  in_params 'date-gte'
  in_params 'date-lte'
  in_params 'item_cd'
  in_params 'loc_cd'
  in_params 't_loc_cd'
  
  out_params :whi_dt
  out_params :item_cd
  out_params :item_nm
  out_params :item_tp
  out_params :lot_size
  out_params :box_qty
  out_params :lot_rqty
  out_params :baseloc_cd
  out_params :loc_cd
  out_params :outbaseloc_cd
  out_params :outloc_cd
end

puts "Custom Selection created!"

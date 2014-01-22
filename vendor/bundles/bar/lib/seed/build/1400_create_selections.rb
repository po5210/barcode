puts "Loading [1400_create_selections] file..."

puts "Custom Selection creating..."

domain = Domain.system_domain
admin = User.find_by_login('admin')
User.current_user = admin

# 바코드 품목 조회 (public/bundle/bar/view/InvoiceSearch.js에서 품목 (item_cd) 조회시 사용)
BarItemsSelection = DiySelection.setup domain, SelectBarItems, {:script_type => 'DSL', :view_type => 'LIST'} do
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
BarBillNbsSelection = DiySelection.setup domain, SelectBarBillNbs, {:script_type => 'DSL', :view_type => 'LIST'} do
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

puts "Custom Selection created!"

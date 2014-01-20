puts "Loading [1400_create_reports] file..."

puts "Custom Selection creating..."

domain = Domain.system_domain
admin = User.find_by_login('admin')
User.current_user = admin

BarItemsSelection = DiySelection.setup domain, SelectBarItems, {:script_type => 'DSL', :view_type => 'LIST'} do
  @count_logic = '100'
  @service_logic = <<-EOS
  query_params = params["_q"]
  name_like = query_params["name-like"] unless(query_params["name-like"].blank?)
  name_like = "UPPER('%\#{name_like}%')" if(name_like)

  data_sql = "
  SELECT 
      ID, NAME, DESCRIPTION, ITEM_TP, UNIT, NVL(DEFAULT_QTY, 0), 
      NVL(CKDBOX_QTY, 0), NVL(PALLET_QTY, 0), LABEL_PRINT_FG, USE_YN
  FROM PRODUCTS
      WHERE NAME IS NOT NULL"

  data_sql << " AND UPPER(NAME) LIKE \#{name_like}" if(name_like)
  count_sql = "SELECT COUNT(*) CNT FROM PRODUCTS WHERE NAME IS NOT NULL"
  count_sql << " AND UPPER(NAME) LIKE \#{name_like}" if(name_like)

  count_result = ActiveRecord::Base.connection.select_all(count_sql)
  data_results = ActiveRecord::Base.connection.select_all(data_sql)

  results = {
      :items => data_results,
      :total_count => count_result[0]["cnt"],
      :success => true
  }

  results
  EOS
end

puts "Custom Selection created!"

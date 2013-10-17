debug_print "Loading [Base] bundle data..."

domain = Domain.system_domain
Domain.create :name => 'System', :system_flag => true, :timezone => 'Seoul', :creator_id => 'admin', :updater_id => 'admin' unless domain
domain = Domain.system_domain
domain.timezone = 'Seoul' unless domain.timezone
domain.save

puts "Shift data creating..."
data = { :domain_id => domain.id, :total_shift => 2, :shift1_start => '08:00', :shift1_end => '20:00', :shift2_start => '20:00', :shift2_end => '08:00' }
shift = Shift.new(data)
shift.save

puts "User data creating..."
admin = User.create({:login => 'admin', :name => 'Admin', :email => 'admin@example.com', :password => 'admin', :password_confirmation => 'admin', :admin_flag => true, :timezone => 'Seoul', :lang => 'en-US', :default_domain_id => domain.id}, :without_protection => true)
User.create({:login => 'manager', :name => 'Manager', :email => 'manager@example.com', :password => 'manager', :password_confirmation => 'manager', :admin_flag => false, :timezone => 'Seoul', :lang => 'en-US', :default_domain_id => domain.id, :active_flag => true}, :without_protection => true)
User.create({:login => 'operator', :name => 'Operator', :email => 'operator@example.com', :password => 'operator', :password_confirmation => 'operator', :admin_flag => false, :timezone => 'Seoul', :lang => 'en-US', :default_domain_id => domain.id, :active_flag => true}, :without_protection => true)
User.create({:login => 'supervisor', :name => 'Supervisor', :email => 'supervisor@example.com', :password => 'supervisor', :password_confirmation => 'supervisor', :admin_flag => false, :timezone => 'Seoul', :lang => 'en-US', :default_domain_id => domain.id, :active_flag => true}, :without_protection => true)
User.current_user = admin

puts "Common Code creating..."
CommonCode.setup domain, :LANGUAGE, {:description => 'Language code'} do
  code 'en-US' => 'English'
  code 'ko-KR' => 'Korean' #'한글'
  code 'zh-CN' => 'Chinese' #'中文'
end

CommonCode.setup domain, :TERMS_CATEGORY, {:description => 'Terminology categories'} do
  code 'button' => 'Button'
  code 'label' => 'Label'
  code 'text' => 'Text'
  code 'error' => 'Error'
  code 'format' => 'Format'
  code 'menu' => 'Menu'
  code 'setting' => 'Setting'
  code 'title' => 'Title'
end

CommonCode.setup domain, :MENU_TYPE, {:description => 'Menu type'} do
  code :MENU => 'Menu'
  code :SCREEN => 'Screen'
  code :TEMPLATE => 'Template'
  code :SEPARATOR => 'SEPARATOR'
end

CommonCode.setup domain, :MENU_CATEGORY, {:description => 'STANDARD OR TERMINAL'} do
  code :STANDARD => 'STANDARD'
  code :TERMINAL => 'TERMINAL'
end

CommonCode.setup domain, :SCRIPT_TYPE, {:description => 'Script type'} do
  code 'JSON' => 'Json data'
  code 'SQL' => 'Database Query'
  code 'DSL' => 'Business Logic'
  code 'DSL-SQL' => 'Query Made by Logic'
end

CommonCode.setup domain, :VIEW_TYPE, {:description => 'View type'} do
  code :SELECTOR => 'Selector'
  code :LIST => 'List'
end

CommonCode.setup domain, :INPUT_ITEM_COUNT, {:description => 'Input Item Count'} do
  code '0' => '0'
  code '1' => '1'
  code '*' => 'Multiple'
end

CommonCode.setup domain, :YES_NO, {:description => 'Yes or No'} do
  code :Y => 'Yes'
  code :N => 'No'
end

CommonCode.setup domain, :ENTITY_REF_TYPE, {:description => 'Entity Reference Type'} do
  code :CommonCode => 'CommonCode'
  code :Entity => 'Entity'
end

CommonCode.setup domain, :ENTITY_FIELD_TYPE, {:description => 'Entity Field Type'} do
  code :string => 'string'
  code :text => 'text'
  code :integer => 'integer'
  code :float => 'float'
  code :decimal => 'decimal'
  code :date => 'date'
  code :datetime => 'datetime'
  code :timestamp => 'timestamp'
  code :time => 'time'
  code :boolean => 'boolean'
  code :binary => 'binary'
end

puts "Entity data creating..."
Entity.setup domain, Domain, {:bundle =>'base'} do
  @list_columns = ['name', 'description', 'system_flag']
  @search_columns = ['name']
  @sort_columns = ['name']
  @editable_columns = ['description']
end

Entity.setup domain, User, {:bundle =>'base'} do
  @list_columns = ['login', 'name', 'email', 'dept', 'default_domain_id', 'admin_flag', 'operator_flag', 'creator_id', 'created_at', 'updater_id', 'updated_at']
  @search_columns = ['login', 'name', 'dept', 'admin_flag', 'operator_flag']
  @sort_columns = ['login']
  @editable_columns = []
end

Entity.setup domain, Role, {:bundle =>'base'} do
  @list_columns = ['name', 'description', 'creator_id', 'created_at', 'updater_id', 'updated_at']
  @search_columns = ['name', 'description', 'updater_id', 'updated_at']
  @sort_columns = ['name']
  @editable_columns = ['description']
end

Entity.setup domain, CommonCode, {:bundle => 'base'} do 
  @list_columns = ['name', 'description', 'creator_id', 'created_at', 'updater_id', 'updated_at']
  @search_columns = ['name', 'description']
  @sort_columns = ['name']
  @editable_columns = ['description']
  #column :parent_id, :resource => 'CommonCode'
end

Entity.setup domain, Entity, {:bundle => 'base'} do
  @list_columns = ['name', 'description', 'bundle', 'creator_id', 'created_at', 'updater_id', 'updated_at']
  @search_columns = ['name', 'description', 'bundle']
  @sort_columns = ['bundle', 'name']
  @editable_columns = ['description']
end

Entity.setup domain, Menu, {:bundle => 'base'} do 
  @list_columns = ['name', 'description', 'category', 'menu_type', 'rank', 'hide_flag', 'creator_id', 'created_at', 'updater_id', 'updated_at']
  @search_columns = ['name', 'description']
  @sort_columns = ['rank']
  @editable_columns = ['description', 'rank']
  #column :parent_id, :resource => 'Menu'
end

Entity.setup domain, DiyService, {:bundle => 'base'} do
  @list_columns = ['name', 'description', 'script_type', 'active_flag', 'atomic_flag']
  @search_columns = ['name', 'description', 'script_type', 'active_flag', 'atomic_flag']
  @sort_columns = ['name']
  @editable_columns = ['description', 'script_type', 'active_flag', 'atomic_flag']
end

Entity.setup domain, DiySelection, {:bundle => 'base'} do
  @list_columns = ['name', 'description', 'script_type', 'view_type']
  @search_columns = ['name', 'description', 'script_type', 'view_type']
  @sort_columns = ['name']
  @editable_columns = ['description', 'script_type', 'view_type']
end

Entity.setup domain, DiyReport, {:bundle => 'base'} do
  @list_columns = ['name', 'description', 'diy_selection_id', 'updater_id', 'updated_at']
  @search_columns = ['name', 'description', 'diy_selection_id']
  @sort_columns = ['name']
  @editable_columns = ['description', 'diy_selection_id']
end

Entity.setup domain, FileGroup, {:bundle => 'base'} do
  @list_columns = ['name', 'description', 'updater_id', 'updated_at']
  @search_columns = ['name', 'description']
  @sort_columns = ['name']
  @editable_columns = ['description']
end

Entity.setup domain, Terminology, {:bundle => 'base'} do
  @list_columns = ['name', 'description', 'language', 'region', 'category', 'display', 'display_short', 'updater_id', 'updated_at']
  @search_columns = ['name', 'description', 'language', 'region', 'category', 'display', 'display_short', ]
  @sort_columns = ['name']
  @editable_columns = ['name', 'description', 'language', 'region', 'category', 'display', 'display_short']
end

puts "Menu creating..."
Menu.setup domain, :System, {:rank => 10000} do
  submenu :Domain, {:rank => 100, :template => 'Base.view.domain.DomainDetail'}
  submenu :User, {:rank => 200, :template => 'Base.view.user.User'}
  submenu :Role, {:rank => 300, :template => 'Base.view.role.Role'}
  submenu :CommonCode, {:rank => 400, :template => 'Base.view.common_code.CommonCode'}
  submenu :Terminology, {:rank => 500, :template => 'Base.view.terminology.Terminology'}
  submenu :Menu, {:rank => 600, :template => 'Base.view.menu.Menu'}
  submenu :Entity, {:rank => 700, :template => 'Base.view.entity.Entity'}
  submenu :DiyService, {:rank => 800, :template => 'Base.view.diy_service.DiyService'}
  submenu :DiySelection, {:rank => 900, :template => 'Base.view.diy_selection.DiySelection'}
  submenu :FileGroup, {:rank => 1000, :template => 'Base.view.file_group.FileGroup'}  
  # submenu :DiyReport, {:rank => 110, :template => 'Base.view.diy_report.DiyReport'}
end

puts "Role data creating..."
save_data(domain.roles, {:name => 'Superuser'}, admin)
save_data(domain.roles, {:name => 'Admin'}, admin)
save_data(domain.roles, {:name => 'Manager'}, admin)
save_data(domain.roles, {:name => 'Supervisor'}, admin)
save_data(domain.roles, {:name => 'Operator'}, admin)
save_data(domain.roles, {:name => 'Developer'}, admin)
save_data(domain.roles, {:name => 'QA'}, admin)

puts "Terminology uploading..."

require 'utils/upload_locale'

upload_locale

puts "Completed to load [Base] bundle data!"
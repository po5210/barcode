class DomainResourcesController < InheritedResources::Base
  
  belongs_to :domain
  respond_to :html, :xml, :json, :xls
  before_filter :authenticate_user!
  
  public
  def index
    conditions, include_arr, order_str, limit, offset = search_filter resource_class
    @total_count = collection.where(conditions).count
    @collection = collection.includes(include_arr).where(conditions).order(order_str).limit(limit).offset(offset)
  end
  
  def show_by_name
    name = params[:name]
    set_resource_ivar(resource_class.where({:domain_id => @domain.id}).find_by_name(name))

    respond_with(resource) do |format|
      format.xml  { render 'show' }
      format.json { render 'show' }
    end
  end
  
  def show
    show!
  end
  
  def create
    create!
  end
  
  def update
    update!
  end
  
  def destroy
    destroy!
  end
  
  def update_multiple
    delete_list, update_list, create_list = self.refine_multiple_data(params[:multiple_data])
    # 1. delete
    self.destroy_multiple_data(resource_class, delete_list)
    # 2. update
    self.update_multiple_data(resource_class, update_list, 'id', [], {})
    # 3. create
    self.create_multiple_data(resource_class, create_list, true, 'id', [], {})
    
    respond_to do |format|
      format.xml  { render :xml => {:success => true, :msg => 'Success'} }
      format.json { render :json => {:success => true, :msg => 'Success'} }
    end
  end
  
  def import
    resource_class.importable(@domain, resource_class, params[:file])
    
    respond_to do |format|
      format.xml  { render :xml => {:success => true, :msg => 'Success'} }
      format.json { render :json => {:success => true, :msg => 'Success'} }
    end
  end
  
  def export
    conditions, include_arr, order_str, limit, offset = search_filter resource_class
    list = collection.includes(include_arr).where(conditions).order(order_str)
    entity = @domain.entities.find_by_name(resource_class.to_s)
    raise Hatio::Exception::MisConfigured, (I18n.translate 'error.entity_not_found') + '(' + resource_class.to_s + ')' unless entity
    @export_columns = EntityColumn.where("entity_id = ? and list_rank > 0 and name not in ('creator_id', 'updater_id', 'created_at', 'updated_at')", entity.id).order("list_rank asc")
    
    @collection = list.collect do |data|
      result = {}
      @export_columns.each do |column|
			  val = data[column.name]
			  if(column.ref_type == 'Entity')
				  ref_name = column.ref_name
				  val = data.send column.name.sub('_id', '')
				  val = val.name if val
			  elsif(column.ref_type == 'CommonCode')
				  ref_name = column.ref_name
				  code_master = @domain.common_codes.find_by_name(ref_name)
				  code = code_master.codes.find { |c| c.name == val.to_s }
				  val = code.description if(code)
			  end
			  
			  if(column.column_type == 'boolean')
			    val = (val.to_s.downcase == 'true') ? 'Y' : 'N' 
			  elsif(column.column_type == 'date')
			    val = val.strftime(GlobalConfig.date_format) if(val)
		    elsif(column.column_type == 'datetime')
		      val = val.strftime(GlobalConfig.datetime_format) if(val)
		    end
		    
		    result[column.name] = val
      end
      result
    end
    
    respond_to do |format|
      format.json { render :json => @collection }
      format.xml { render :xml => @collection }
      format.xls
    end
  end
  
  def open_spreadsheet(file)
    case File.extname(file.original_filename)
      when ".csv" then Csv.new(file.path, nil, :ignore)
      when ".xls" then Excel.new(file.path, nil, :ignore)
      when ".xlsx" then Excelx.new(file.path, nil, :ignore)
      else raise Hatio::Exception::InvalidRequest, (I18n.translate 'error.unknown_file_type')
    end
  end
  
  #
  # 클라이언트 화면에서 보내주는대로 엑셀 출력 
  #
  def export_by_client
    @export_data = JSON.parse(params[:xlsGridInfo])
    @headers = @export_data.shift
    
    respond_to do |format|
      format.json { render :json => @export_data }
      format.xml { render :xml => @export_data }
      format.xls
    end
  end
  
  protected
  
  #
  # 클라이언트로 부터 넘어온 multiple_data를 삭제 데이터, 수정 데이터, 생성 데이터로 분리하여 리턴 
  #
  def refine_multiple_data(multiple_data)
    data_list = JSON.parse(multiple_data)
    delete_list, update_list, create_list = [], [], [];

    data_list.each do |data|
      cud_flag = data.delete('_cud_flag_')
      delete_list << data['id'] if(cud_flag == "d")
      update_list << data if(cud_flag == "u")
      create_list << data if(cud_flag == "c")
    end
    
    return delete_list, update_list, create_list
  end
  
  #
  # 삭제할 데이터 아이디로 correspond_class의 destroy를 호출 
  #
  def destroy_multiple_data(correspond_class, multiple_data)
    correspond_class.destroy(multiple_data) unless multiple_data.empty?
  end
  
  #
  # correspond_class로 갱신할 데이터를 수정한다. 
  # 이 때 idField 명을 받아서 data로 부터 해당 필드값을 꺼내 correspond_class의 인스턴스를 찾은 다음 data를 update 한다.
  # update전에 추가해야 할 속성명, 값과 삭제해야 할 속성명이 있다면 각 레코드당 처리한다.
  #
  def update_multiple_data(correspond_class, multiple_data, idField = 'id', attrs_to_remove = [], attrs_to_add = {})
    multiple_data.each do |data|
      found_resource = correspond_class.find_by_id(data.delete(idField))
      if found_resource
        attrs_to_remove.each { |p| data.delete(p) }
        data.merge(attrs_to_add) unless attrs_to_add.empty?
        found_resource.update_attributes(data, :without_protection => true)
      end
    end if multiple_data
  end
  
  #
  # correspond_class로 추가할 데이터를 생성한다. 
  # domain_resource_flag는 domain 하위 리소스인지를 나타낸다. 해당 리소스가 domain 하위가 아니라면 false로 설정한다.
  # update전에 추가해야 할 속성명, 값과 삭제해야 할 속성명이 있다면 각 레코드당 처리한다.
  #
  def create_multiple_data(correspond_class, multiple_data, domain_resource_flag = true, idField = 'id', attrs_to_remove = [], attrs_to_add = {})
    multiple_data.each do |data|
      data.delete(idField)
      attrs_to_remove.each { |p| data.delete(p) }
      attrs_to_add['domain_id'] = @domain.id if(domain_resource_flag && !data.key?('domain_id'))
      data.merge(attrs_to_add) unless attrs_to_add.empty?
      correspond_class.create!(data, :without_protection => true)
    end if multiple_data
  end
  
end
class HatioResourceViewUtil
  
  DATA_TYPE_NUMBER = ['integer', 'float', 'long', 'double', 'decimal']
  DATA_TYPE_DATE = ['date', 'datetime', 'timestamp']
  DATA_TYPE_TEXT = ['string', 'text']
  SKIP_COLUMN_NAME = ['id', 'domain_id', 'creator_id', 'updater_id', 'created_at', 'updated_at', 'deleted_at', 'version']

  #
  # Form Buttons
  #
  def self.generateFormButtons(view_type, detail_view_type)
    return "['->']" if(!view_type || !detail_view_type)
    return "['->', 'save']" if(view_type == 'detail')
    
    output = "['->'"
    if(detail_view_type == 'popup')
      output << ", 'save', 'close']"
    elsif(detail_view_type == 'view')
      output << ", 'back', 'save', 'delete']"
    else
      output << ", 'back', 'save', 'delete', 'close']"
    end
    return output
  end
  
  #
  # Grid Buttons
  #
  def self.generateGridButtons(detail_view_type)
    return "['->']" if(!detail_view_type)
    
    output = "['->'"
    if(detail_view_type == 'popup')
      output << ", 'add', 'update', 'delete']"
    elsif(detail_view_type == 'view')
      output << ", 'add', 'save', 'delete']"
    else
      output << "]"
    end
    return output
  end
  
  # 
  # columns 정보로 부터 그리드를 생성 
  #   
  def self.generateGrid(domain, singularName, columns, options, indent)
    output = "columns : [\n"
    indent = "\t\t" unless indent
    pk_column = columns.find { |col| col.pk }
    
    columns.each do |col|
      columnInfo = ""
      if(col.name == 'id' || col.name == 'domain_id')
        if(col.name == 'id' || (pk_column && col.name == pk_column.name))
          columnInfo = "{ header : T('label.id'), dataIndex : 'id', hidden : true }"
        elsif(col.name == 'domain_id')
          columnInfo = "{ header : T('label.domain_id'), dataIndex : 'domain_id', sortable : false,  hidden : true }"
        end        
      else
        # list_rank가 0보다 큰 경우만 grid에 표시 
        if((col.list_rank && col.list_rank > 0) || (col.sort_rank && col.sort_rank > 0))
          # 기본 생성, 수정시간 필드는 무조건 disabled 처리 
          if(col.name == 'created_at' || col.name == 'updated_at')
            columnInfo = "{ header : T('label.#{col.name}'), dataIndex : '#{col.name}', xtype : 'datecolumn', format : T('format.datetime'), width : 120 }"
          # reference 인 경우는 해당 reference에 맞게 처리 
          elsif(col.ref_type && !col.ref_type.empty?)
            columnInfo = self.getGridColumnByRef(domain, col)
          # 일반적인 필드인 경우
          else
            columnInfo = self.getGridColumn(domain, col)
          end
        end
        
        columnInfo = addGridSortOption(columnInfo, col) if(col.sort_rank && col.sort_rank > 0)
      end
      
      output << "#{indent}#{columnInfo},\n" if(columnInfo && !columnInfo.empty?)
    end

    output << "#{indent}{ header : 'cud flag', dataIndex : '_cud_flag_', hidden : true, sortable : false, width : 0, value : '' }\n\t]"
    output
  end
  
  #
  # grid column 정보에 sort option을 추가한다.
  #  
  def self.addGridSortOption(columnInfo, col)
    sortDirection = col.reverse_sort ? 'desc' : 'asc'
    sortOption = ", sortOption : { sortSeq : #{col.sort_rank}, sortDirection : '#{sortDirection}' } }"
    columnInfo.strip!
    infoLength = columnInfo.length - 2
    columnInfo = columnInfo[0..infoLength]
    columnInfo << sortOption
    columnInfo
  end
  
  # 
  # column의 reference type정보로 부터 grid column 정보를 얻는다.
  #
  def self.getGridColumnByRef(domain, column)
    columnInfo = ""
    if(column.ref_type == 'CommonCode')
      columnInfo << "{ header : T('label.#{column.name}'), dataIndex : '#{column.name}', xtype : 'codecolumn', tpl : '{description}', commonCode : '#{column.ref_name}'"
      columnInfo << ", editor : { xtype : 'codecombo', commonCode : '#{column.ref_name}' }" if(column.editable)
      columnInfo << " }"
    elsif(column.ref_type == 'Entity')
      if(column.name.end_with?('_id') && column.ref_name)
        data_label = column.name[0 .. column.name.rindex('_') - 1]
        storeName = findStoreName(domain, column, data_label)
        columnInfo << "{ header : #{storeName[0]}, dataIndex : '#{data_label}', xtype : 'entitycolumn'"
        columnInfo << ", editor : { xtype: 'entityfield', storeClass: '#{storeName[1]}' }"  if(column.editable)
        columnInfo << " }"
      else
        columnInfo << getGridColumn(domain, column)
      end
    else
      columnInfo << getGridColumn(domain, column)
    end
    columnInfo
  end
  
  #
  # entity name으로 store명을 추출 
  #
  def self.findStoreName(domain, column, data_label)
    entity = domain.entities.find_by_name(column.ref_name);
    
    if(SKIP_COLUMN_NAME.include?(column.name))
      title = "T('label.#{data_label ? data_label : column.name}')"
    else
      title = data_label ? "T('title.#{data_label}')" : "T('label.#{column.name}')";
    end
    
    ["#{title}", "#{entity.bundle.camelcase}.store.#{entity.name}"]
  end
  
  # 
  # column으로 부터 grid column 정보를 얻는다.
  #
  def self.getGridColumn(domain, col)
    output = ""
    column_type = col.column_type
    if(column_type == 'string')
      output = "{ header : T('label.#{col.name}'), dataIndex : '#{col.name}' "
      output << ", editor : { xtype : 'textfield' } " if(col.editable)
      output << "}"
    elsif(column_type == 'text')
      output = "{ header : T('label.#{col.name}'), dataIndex : '#{col.name}' "
      output << ", editor : { xtype : 'textareafield' } " if(col.editable)
      output << "}"
    elsif(column_type == 'boolean')
      output = "{ header : T('label.#{col.name}'), dataIndex : '#{col.name}', xtype : 'checkcolumn' }"
    elsif(column_type == 'date')
      if(col.editable)
        output = "{ header : T('label.#{col.name}'), dataIndex : '#{col.name}', xtype : 'datecolumn', editor : { xtype : 'datefield', submitFormat : T('format.submitDate') } }"
      else
        output = "{ header : T('label.#{col.name}'), dataIndex : '#{col.name}', xtype : 'datecolumn', format : T('format.date') }"
      end
    elsif(column_type == 'datetime' || column_type == 'timestamp')
      if(col.editable)
        output = "{ header : T('label.#{col.name}'), dataIndex : '#{col.name}', xtype : 'datecolumn', format : T('format.datetime'), editor : { xtype : 'datetimefield', format : T('format.date'), submitFormat : T('format.submitDatetime') } }"
      else
        output = "{ header : T('label.#{col.name}'), dataIndex : '#{col.name}', xtype : 'datecolumn', format : T('format.datetime') }"
      end
    elsif(checkNumberColumn(column_type))
      output = "{ header : T('label.#{col.name}'), dataIndex : '#{col.name}', xtype : 'numbercolumn', format : T('format.number'), align : 'right' "
      output << ", editor : { xtype : 'numberfield' } " if(col.editable)
      output << "}"
    end
    return output
  end
  
  # 
  # resource의 columns로 부터 form 정보를 생성하여 리턴 
  #   
  def self.generateForm(domain, resourceName, columns, options, indent)
    output = "items : [\n\t"
    indent = "\t" unless indent
    pk_column = columns.find { |col| col.pk_column? }

    columns.each do |col|
      columnInfo = ""
      if(col.name == 'id' || (pk_column && col.name == pk_column.name))
        columnInfo = "{ name : '#{col.name}', fieldLabel : T('label.#{col.name}'), hidden : true }"
      elsif(col.name == 'name')
        columnInfo = "{ name : '#{col.name}', fieldLabel : T('label.#{col.name}'), allowBlank : false, maxLength : 64 }"
      elsif(col.name == 'description')
        columnInfo = "{ name : '#{col.name}', fieldLabel : T('label.#{col.name}'), maxLength : 255 }"
      elsif(col.name == 'domain_id')
        columnInfo = "{ name : 'domain_id', value : login.current_domain_id, hidden : true }"
      elsif(col.name == 'creator_id' || col.name == 'updater_id')
        # TODO
      elsif(col.name == 'created_at' || col.name == 'updated_at')
        columnInfo = "{ xtype : 'datefield', name : '#{col.name}', disabled : true, fieldLabel : T('label.#{col.name}'), format : T('format.datetime') }"
      elsif(col.ref_type && !col.ref_type.empty?)
        columnInfo = self.getFormColumnByRef(domain, col)
      else
        columnInfo = self.getFormColumn(domain, col)
      end
      output << "\t#{columnInfo},\n\t" if columnInfo && !columnInfo.empty?
    end

    output << "]"
    output
  end
  
  # 
  # column의 reference type정보로 부터 form column 정보를 얻는다.
  #
  def self.getFormColumnByRef(domain, col)
    if(col.ref_type == 'CommonCode')
      return "{ fieldLabel : T('label.#{col.name}'), name : '#{col.name}', xtype : 'codecombo', commonCode : '#{col.ref_name}', displayField : 'description' }"
    elsif(col.ref_type == 'Entity')
      entity_name = col.name[0 .. col.name.rindex('_') - 1]
      storeName = findStoreName(domain, col, entity_name)
      return "{ fieldLabel : #{storeName[0]}, name : '#{entity_name}', xtype : 'entityfield', storeClass : '#{storeName[1]}' }"
    else
      return ""
    end
  end
  
  # 
  # column으로 부터 form column 정보를 얻는다.
  #
  def self.getFormColumn(domain, col)
    column_type = col.column_type
    if(column_type == 'string')
      "{ name : '#{col.name}', fieldLabel : T('label.#{col.name}') }"
    elsif(column_type == 'text')
      "{ xtype : 'textareafield', name : '#{col.name}', fieldLabel : T('label.#{col.name}'), rows : 3 }"
    elsif(column_type == 'boolean')
      "{ name : '#{col.name}', fieldLabel : T('label.#{col.name}'), xtype : 'checkboxfield', inputValue : true }"
    elsif(column_type == 'date')
      "{ xtype : 'datefield', name : '#{col.name}', fieldLabel : T('label.#{col.name}'), format : T('format.date'), submitFormat : T('format.submitDate') }"
    elsif(column_type == 'datetime' || column_type == 'timestamp')
      "{ xtype : 'datetimefield', name : '#{col.name}', fieldLabel : T('label.#{col.name}'), format : T('format.date'), submitFormat : T('format.submitDatetime') }"
    elsif(checkNumberColumn(column_type))
      "{ name : '#{col.name}', fieldLabel : T('label.#{col.name}'), xtype : 'numberfield' }"
    else
      ""
    end
  end

  # 
  # columns 정보로 부터 search condition items를 생성 
  #   
  def self.generateSearchItems(domain, resourceName, columns, options, indent)
    output = "items : [\n\t"
    indent = "\t" unless indent
		search_columns = columns.select { |c| c.search_rank && c.search_rank > 0 }.sort_by(&:search_rank)
		
    search_columns.each do |col|
      if(!self.checkSkipColumn(col))
        if(col.ref_type && !col.ref_type.empty?)
          columnInfo = self.getSearchFormColumnByRef(domain, col)
        else
          columnInfo = self.getSearchFormColumn(domain, col)
        end
        output << "#{indent}#{columnInfo},\n\t" if columnInfo && !columnInfo.empty?
      end
    end
    
    output << "]"
    output
  end
  
  # 
  # column의 reference type정보로 부터 search form column 정보를 얻는다.
  #
  def self.getSearchFormColumnByRef(domain, col)
    if(col.ref_type == 'CommonCode')
      return "{ fieldLabel : T('label.#{col.name}'), name : '#{col.name}-eq', xtype : 'codecombo', commonCode : '#{col.ref_name}', displayField : 'description' }"
    elsif(col.ref_type == 'Entity')
      data_label = col.name[0 .. col.name.rindex('_') - 1]
      storeName = findStoreName(domain, col, data_label)
      return "{ fieldLabel : #{storeName[0]}, name : '#{data_label}.name-eq', xtype : 'entitysearchcombo', storeClass : '#{storeName[1]}', valueField : 'name' }"
    else
      return ""
    end
  end
  
  # 
  # column의 정보로 부터 search form column 정보를 얻는다.
  #
  def self.getSearchFormColumn(domain, col)
    column_type = col.column_type
    if(checkTextColumn(column_type))
      return "{ fieldLabel : T('label.#{col.name}'), name : '#{col.name}-like' }"
    elsif(column_type == 'boolean')
      return "{ fieldLabel : T('label.#{col.name}'), name : '#{col.name}-eq', xtype : 'checkboxfield', inputValue : true }"
    elsif(column_type == 'date')
      return "{ fieldLabel : T('label.date'), name : '#{col.name}-eq', xtype : 'datefield', format : T('format.date'), submitFormat : T('format.submitDate') }"
    elsif(column_type == 'datetime' || column_type == 'timestamp')
      output = "{ fieldLabel : T('label.#{col.name}_from'), name : '#{col.name}-gte', xtype : 'datetimefield', format : T('format.date'), submitFormat : T('format.submitDatetime') },\n"
      output << "\t\t{ fieldLabel : T('label.#{col.name}_to'), name : '#{col.name}-lte', xtype : 'datetimefield', format : T('format.date'), submitFormat : T('format.submitDatetime') }"
      return output
    elsif(checkNumberColumn(column_type))
      return "{ fieldLabel : T('label.#{col.name}'), name : '#{col.name}-eq', xtype : 'numberfield', format : T('format.number') }"
    else
      return ""
    end
  end
  
  # 
  # columns 정보로 부터 model fields 정보를 설정  
  #
  def self.generateModelFields(columns, indent)
    indent = "\t\t" unless indent
    validations = nil
    output = "fields : [\n"
    columns.each do |col|
      
      next if (col.name == 'deleted_at' || col.name == 'version')
      
      output << "#{indent}{ name : '#{col.name}', type : '"
      if(col.column_type == 'date')
        output << "date', dateWriteFormat : T('format.submitDate') },\n" 
      elsif(col.column_type == 'datetime' || col.column_type == 'timestamp')
        if(col.name == 'created_at' || col.name == 'updated_at')
          output << "date' },\n" 
        else
          output << "date', dateWriteFormat : T('format.submitDatetime') },\n" 
        end
      else
        output << "#{col.column_type}' },\n"
      end
      
      # ref_type이 Entity이고 ref_name이 _id로 끝나면 ....
      if(col.ref_type && col.ref_type == 'Entity' && col.ref_name && col.name != 'domain_id')
        if(col.name == 'creator_id')
          output << "#{indent}{ name : 'creator', type : 'auto' },\n"
        elsif(col.name == 'updater_id')
          output << "#{indent}{ name : 'updater', type : 'auto' },\n"
        else
          output << "#{indent}{ name : '#{col.ref_name.underscore}', type : 'auto' },\n"
        end
      end
      
      if(col.name == 'name')
        validations = ",\n\n\tvalidations : [\n"
        validations << "\t\t{type : 'presence', field : 'name'}\n"
        validations << "\t]"
      end
    end

    output << "#{indent}{ name : '_cud_flag_', type : 'string' }\n\t]"
    output << validations if validations
    output
  end
  
  # 
  # 처리를 skip할 columns 정보인지 체크 
  #
  def self.checkSkipColumn(col)
    return SKIP_COLUMN_NAME.include?(col.name) ? true : false
  end
  
  # 
  # number형 컬럼인지 체크 
  #
  def self.checkNumberColumn(column_type)
    return DATA_TYPE_NUMBER.include?(column_type) ? true : false
  end
  
  # 
  # 문자형 컬럼인지 체크 
  #
  def self.checkTextColumn(column_type)
    return DATA_TYPE_TEXT.include?(column_type) ? true : false
  end
  
  # 
  # 날짜형 컬럼인지 체크 
  #
  def self.checkDateColumn(column_type)
    return DATA_TYPE_DATE.include?(column_type) ? true : false
  end
end
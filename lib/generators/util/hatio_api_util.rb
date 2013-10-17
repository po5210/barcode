class HatioApiUtil
  #
  # index template 생성 
  #
  def self.generateIndexTemplate(singular_name, columns)
    output = "json.items do |json|\n\t"
    output << "json.array!(@collection) do |#{singular_name}|\n\t\t"    
    output << generateIndexJsonBuilder(singular_name, columns)
    ref_columns = columns.select { |column| column.name != 'domain_id' && column.ref_type == 'Entity' && column.ref_name }
    
    ref_columns.each do |ref_column|
      next if (!ref_column.list_rank || ref_column.list_rank <= 0)
      ref_singular_name = ref_column.ref_name.underscore
      
      if(ref_column.name == 'creator_id')        
        output << "json.creator do\n\t\t\t"
        output << "json.id #{singular_name}.creator_id\n\t\t\t"
        output << "json.name #{singular_name}.creator ? #{singular_name}.creator.name : ''\n\t\t"
        output << "end\n\n\t\t"
      elsif(ref_column.name == 'updater_id')
        output << "json.updater do\n\t\t\t"
        output << "json.id #{singular_name}.updater_id\n\t\t\t"
        output << "json.name #{singular_name}.updater ? #{singular_name}.updater.name : ''\n\t\t"
        output << "end\n\n\t\t"
      elsif(ref_column.name.ends_with?('_id'))
        output << "json.#{ref_singular_name} do\n\t\t\t"
        output << "json.id #{singular_name}.#{ref_column.name}\n\t\t\t"
        output << "json.name #{singular_name}.#{ref_singular_name} ? #{singular_name}.#{ref_singular_name}.name : ''\n\t\t"
        output << "end\n\n\t\t"
      end
    end
    
    output << "end\n"
    output << "end\n"
    output << "json.total @total_count\n"
    output << "json.success true\n"
    output
  end
  
  #
  # show, create, update.json.jbuilder 에서 사용할 json builder
  #
  def self.generateSingleJsonBuilder(singular_name, all_attrs)
    output = "json.(@#{singular_name}, "
    all_attrs.each_with_index do |attr, index|
      unless (check_skip(attr))
        output << "," if(index > 0)
        output << ":#{attr.name}"
      end 
    end
    output << ")\n\t\t"
    output
  end
  
  #
  # index.jbuilder 에서 사용할 json builder
  #
  def self.generateIndexJsonBuilder(singular_name, all_attrs)
    output = "json.(#{singular_name}, "
    all_attrs.each_with_index do |attr, index|
      unless (check_skip(attr))
        output << "," if(index > 0)
        output << ":#{attr.name}"
      end 
    end
    output << ")\n\t\t"
    output
  end
  
  def self.check_skip(attribute)
    attr_name = attribute.name
    return (attr_name == 'deleted_at' || attr_name == 'version')
  end
  
end
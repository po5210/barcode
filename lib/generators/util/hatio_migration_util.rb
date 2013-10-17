class HatioMigrationUtil
  
  #
  # 입력한 attributes들로 부터 GeneratedAttribute를 생성하여 array로 리턴 
  #
  def self.generatedAttributes(model_attributes)
    
    attrs = []
    model_attributes.each do |attribute|
      attrs << Rails::Generators::GeneratedAttribute.new(*attribute.split(":")) if attribute.include?(":")
    end
    
    return attrs
  end
  
  #
  # generate db migration file number 
  #
  def self.next_migration_number
    Time.now.utc.strftime("%Y%m%d%H%M%S")
  end
  
  #
  # id option str 
  #
  def self.id_option_str(id_type)
    if(id_type == 'auto-increment')
      return ''
    elsif(id_type == 'none')
      return ':id => false'
    else
      return ":id => :#{id_type}"
    end
  end
  
  #
  # 입력된 attributes로 부터 migration fields를 추가 
  #
  def self.add_migration_fields(attributes)
    output = ""
    useUserstamp, useTimestamp = false, false
    
    attributes.each do |attr|
      if (attr.name == 'id')
      elsif(attr.name == 'domain_id')
        output << "\t\t\tt.references :domain, :null => false\n"
      elsif(attr.name == 'creator_id' || attr.name == 'updater_id')
        useUserstamp = true
      elsif(attr.name == 'created_at' || attr.name == 'updated_at')
        useTimestamp = true
      elsif(attr.name == 'name')
        output << "\t\t\tt.references :name, :null => false, :limit => 64\n"
      else
        begin
          output << "\t\t\tt.#{attr.type} :#{attr.name}\n"
        rescue
          output << "\t\t\tt.#{attr.column_type} :#{attr.name}\n"
        end
      end
    end
    
    output << "\t\t\tt.userstamps\n" if useUserstamp
    output << "\t\t\tt.timestamps\n" if useTimestamp
    output
  end
  
  #
  # add migration index 
  #
  def self.add_migration_index(tableName, attributes)
    output = ""
    
    domainIdAttr = attributes.find { |attr| attr.name == 'domain_id' }
    nameAttr = attributes.find { |attr| attr.name == 'name' }
    updatedAtAttr = attributes.find { |attr| attr.name == 'updated_at' }
    index_seq = 0;
    
    if(domainIdAttr)
      if(nameAttr)
        output << "\t\tadd_index :#{tableName}, [:domain_id, :name], :unique => true, :name => :index_#{tableName}_#{index_seq}\n"
        index_seq += 1
      end
      if(updatedAtAttr)
        output << "\t\tadd_index :#{tableName}, [:domain_id, :updated_at], :name => :index_#{tableName}_#{index_seq}\n"
        index_seq += 1
      end
    else
      if(updatedAtAttr)
        output << "\t\tadd_index :#{tableName}, [:updated_at], :name => :index_#{tableName}_#{index_seq}\n"
        index_seq += 1
      end
    end
    
    output
  end
  
  #
  # remove migration index 
  #
  def self.remove_migration_index(tableName, attributes)
    output = ""
    
    domainIdAttr = attributes.find { |attr| attr.name == 'domain_id' }
    nameAttr = attributes.find { |attr| attr.name == 'name' }
    updatedAtAttr = attributes.find { |attr| attr.name == 'updated_at' }
    index_seq = 0;
    
    if(domainIdAttr)
      if(nameAttr)
        output << "\t\tremove_index :#{tableName}, :name => :index_#{tableName}_#{index_seq}\n"
        index_seq += 1
      end
      if(updatedAtAttr)
        output << "\t\tremove_index :#{tableName}, :name => :index_#{tableName}_#{index_seq}\n"
        index_seq += 1
      end
    else
      if(updatedAtAttr)
        output << "\t\tremove_index :#{tableName}, :name => :index_#{tableName}_#{index_seq}\n"
        index_seq += 1
      end
    end
    
    output
  end
  
  #
  # table migration 내용 생성 
  # 
  def self.create_table_migration(className, tableName, attributes, options, pkColumnName)
    idOption = self.id_option_str(options.id_type)
    pkStr = ""
    if(pkColumnName && pkColumnName != 'id')
      idOption = ":id => false"
      pkStr = "t.string :#{pkColumnName}, :null => false\n"
    end
    
    output = "class Create#{className.pluralize} < ActiveRecord::Migration\n\n"
    output << "\tdef self.up\n"
    output << "\t\tcreate_table #{tableName.to_sym.inspect}, #{idOption} do |t|\n"
    output << "#{HatioMigrationUtil.add_migration_columns(attributes, pkColumnName)}"
    output << "\t\tend\n\n"
    output << "#{HatioMigrationUtil.add_migration_index(tableName, attributes)}"
    if(options.history == 'y')
      output << "\t\t#{className}.create_versioned_table :id => :meaningful\n" 
    end
    output << "\tend\n\n"
    
    output << "\tdef self.down\n"
    if(options.history == 'y')
      output << "\t\t#{className}.drop_versioned_table\n"
    end
    output << "#{HatioMigrationUtil.remove_migration_index(tableName, attributes)}"
    output << "\t\tdrop_table #{tableName.to_sym.inspect}\n"
    output << "\tend\n"
    output << "end"
    
    output
  end
  
  #
  # 입력된 attributes로 부터 migration fields를 추가, columns는 Entity의 Entity Columns
  #
  def self.add_migration_columns(columns, pkColumnName)
    output = ""
    useUserstamp, useTimestamp = false, false
    
    columns.each do |column|
      if(column.name == pkColumnName)
      elsif(column.name == 'domain_id')
        output << "\t\t\tt.references :domain\n"
      elsif(column.name == 'created_at' || column.name == 'updated_at')
        useTimestamp = true
      elsif(column.name == 'creator_id' || column.name == 'updater_id')
        useUserstamp = true
      elsif(column.ref_type == "Entity")
        if(column.name.ends_with?("_id"))
          ref_name = column.name[0 .. column.name.rindex('_') - 1]
          output << "\t\t\tt.references :#{ref_name}\n"
        else
          output << "\t\t\tt.#{column.column_type} :#{column.name}\n"
        end
      else
        output << "\t\t\tt.#{column.column_type} :#{column.name}\n"
      end
    end
    
    output << "\t\t\tt.userstamps\n" if useUserstamp
    output << "\t\t\tt.timestamps\n" if useTimestamp
    output
  end
  
end

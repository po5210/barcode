module Hatio
  module ActsAsImport
    
    def self.included(base) #:nodoc:
      super
      base.extend(ClassMethods)
    end

    module ClassMethods
      
      # def importable(domain, entity, file)
      #   transaction do
      #     spreadsheet = open_spreadsheet(file)
      #     header = spreadsheet.row(1)
      #     (2..spreadsheet.last_row).each do |i|
      #       row = Hash[[header, spreadsheet.row(i)].transpose]
      #       instance = entity.find_by_id(row['id']) || entity.new
      #       data = row.to_hash.slice(*accessible_attributes)
      #       data[:domain_id] = domain.id
      #       instance.update_attributes(data, :without_protection => true)
      #     end
      #   end
      # end
      
      def importable(domain, resource_class, file)
        spreadsheet = open_spreadsheet(file)
        # header parsing - header는 반드시 1 라인에 있어야 함
        header = spreadsheet.row(1)
        entity = domain.entities.find_by_name(resource_class.to_s)
        raise Hatio::Exception::MisConfigured, (I18n.translate 'error.entity_not_found') + '(' + resource_class.to_s + ')' unless entity
        # entity_columns 정보 중에 list_rank가 설정된 것 들에 한해서만 처리한다.
        import_columns = EntityColumn.where("entity_id = ? and list_rank > 0", entity.id).order("list_rank asc")
        import_data_list = []

        (2..spreadsheet.last_row).each do |i|
          #row = Hash[[header, spreadsheet.row(i)].transpose] ==> hash
          row = spreadsheet.row(i) # ==> array
          row_data = {}
          import_columns.each_with_index do |column, idx|
            data = row[idx]
            data = data.strip if(data && data.respond_to?('strip'))
            row_data[column.name.downcase] = data  unless(column.name == 'creator_id' || column.name == 'created_at' || column.name == 'updater_id' || column.name == 'updated_at')
          end
          import_data_list.push(row_data) unless row_data.empty?
        end
        
        resource_class.transaction do
          unless(import_data_list.empty?)
            import_data_list.each do |import_data|
              rsc = resource_class.find_by_domain_id_and_name(domain.id, import_data['name'])
              
              if(rsc)
                # 있으면 스킵 
                debug_print "#{import_data['name']} skipped!"
                next
              else
                rsc = resource_class.new 
                rsc.domain = domain
              end
              
              import_data.each_key do |col_name|
                col_value = import_data["#{col_name}"]
                next if(col_value.nil? || col_value == '')
                import_column = import_columns.find { |import_column| import_column.name == col_name }
                next unless import_column
                
                # 1. 일반 데이터 타입일 경우
                if(!import_column.ref_type || import_column.ref_type == '')
                  val = convert_value_by_type(import_column, col_value)
                  rsc["#{col_name}"] = val
                # 2. 엔티티 일 경우 처리 
                elsif(import_column.ref_type == 'Entity')
                  # ref name으로 find_by_name으로 처리한다.
                  entity_instance = import_column.ref_name.constantize.find_by_domain_id_and_name(domain.id, col_value)
                  raise Hatio::Exception::MisConfigured, (I18n.translate 'error.entity_not_found') + '(' + col_value + ')' unless entity_instance
                  #rsc["#{col_name}"] = "#{domain.id}-#{entity_instance.name}"
                  rsc["#{col_name}"] = entity_instance.id
                # 3. 코드일 경우 처리 
                elsif(import_column.ref_type == 'CommonCode')
                  # ref name으로 코드에서 쿼리하여 name값을 가져온다.
                  common_codes = domain.common_codes.where("name = ? and parent_id is null", import_column.ref_name)
                  if(common_codes && !common_codes.empty?)
                    common_code = common_codes.first
                    code = common_code.codes.find { |code| code.description == col_value }
                    code = common_code.codes.find { |code| code.name == col_value } unless(code)
                    rsc["#{col_name}"] = code.name if(code)
                  else
                    raise Hatio::Exception::MisConfigured, (I18n.translate 'error.code_not_found') + '(' + col_value + ')'
                  end
                end
              end

              rsc.save!
            end
          end
        end
      end
      
      #
      # column type별로 value를 변환한다.
      #
      def convert_value_by_type(column_info, col_value)
        # 타입별 처리 - boolean, date, number등 ...
        case column_info.column_type
          when "boolean"
            if(!col_value)
              return false
            else
              val = col_value.downcase
              return (val == 'true' || val == 't' || val == '1' || val == 'y' || val == 'on') ? true : false
            end
          when "integer"
            return col_value ? col_value.to_i : col_value
          when "float"
            return col_value ? col_value.to_f : col_value
          when "decimal"
            return col_value ? col_value.to_f : col_value
          else
            return col_value
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
      
    end
  end
end

require 'generators/util/hatio_migration_util'
require 'generators/util/hatio_model_util'
require 'generators/util/hatio_api_util'

class HatioResourceApiGenerator < Rails::Generators::NamedBase
  
  source_root File.expand_path('../templates', __FILE__)
  argument :model_attributes, :type => :array, :default => [], :banner => "model:attributes"
  class_option :bundle, :type => :string, :default => '', :desc => "Bundle name"
  class_option :id_type, :type => :string, :default => 'uuid', :description => "id type - uuid|meaningful|auto-increment|none"
  class_option :history, :type => :string, :default => 'n', :desc => 'History option'
  
  def generate_resource_api
    
    begin
      raise "Not allowed empty bundle name" if (!options.bundle || options.bundle.empty?)
      unless ['uuid', 'meaningful', 'auto-increment', 'none'].include?(options.id_type)
        raise "Invalid --id-type option [uuid|meaningful|auto-increment|none]" 
      end
      
      @id_type = options.id_type
      @bundle_name = options.bundle
      bundle_app_path = "vendor/bundles/#{@bundle_name}"
      controller_path = "#{bundle_app_path}/app/controllers"
      model_path = "#{bundle_app_path}/app/models"
      view_path = "#{bundle_app_path}/app/views/#{table_name}"
      migration_path = "#{bundle_app_path}/db/migrate"

      entity = Entity.find_by_name(class_name)
      @attributes = entity.entity_columns
      @all_attrs = @attributes.map { |attr| ':' + attr.name }.join(',')
      @pkColumn = @attributes.find { |attr| attr.pk == true }
      @pkColumnName = @pkColumn ? @pkColumn.name : 'id'

      template "controller.rb", "#{controller_path}/#{table_name}_controller.rb"
      template "model.rb", "#{model_path}/#{singular_name}.rb"
      template "model_version.rb", "#{model_path}/#{singular_name}_version.rb" if(options.history.downcase == 'y')

      view_dir = File.join(Rails.root, view_path)
      FileUtils.mkdir "#{view_dir}" unless File.exist?("#{view_dir}")
      
      template "index.json.jbuilder", "#{view_path}/index.json.jbuilder"
      template "show.json.jbuilder", "#{view_path}/show.json.jbuilder"
      template "create.json.jbuilder", "#{view_path}/create.json.jbuilder"
      template "update.json.jbuilder", "#{view_path}/update.json.jbuilder"
      template "migration.rb", "#{migration_path}/#{HatioMigrationUtil.next_migration_number}_create_#{table_name}.rb"
      
      inject_into_file "#{bundle_app_path}/config/routes.rb", :after => "resources :domains do" do
        "\n\t\tresources :#{table_name} do\n\t\t\tcollection do\n\t\t\t\tpost :update_multiple\n\t\t\tend\n\t\tend\n"
      end
      
      inject_into_file "#{bundle_app_path}/lib/#{@bundle_name}/pluggable_spot.rb", :after => "# HAS_MANY BEGIN BLOCK DON'T REMOVE" do
        "\n\thas_many :#{table_name}"
      end
      
      puts "\nSuccess"
    rescue StandardError => e
      puts "\nError : #{e}"
    end
  end
  
end

require 'open3'

class EntitiesController < DomainResourcesController
  
    skip_before_filter :verify_authenticity_token  
      
    # get domains/:domain_id/entities/:id/entity_columns.json
    def entity_columns
      @entity = Entity.find(params[:id])
      @entity_columns = @entity.entity_columns
    end
    
    # post domains/:domain_id/entities/:id/create_entity_columns.json
    def create_entity_columns
      entity = Entity.find(params[:id])
      @entity_columns = entity.create_entity_columns
    end
    
    # post domains/:domain_id/entities/:id/update_multiple_entity_columns.json
    def update_multiple_entity_columns
      delete_list, update_list, create_list = self.refine_multiple_data(params[:multiple_data])
      # 1. delete
      self.destroy_multiple_data(EntityColumn, delete_list)
      # 2. update
      self.update_multiple_data(EntityColumn, update_list, 'id', ['entity_id'], {})
      # 3. create
      self.create_multiple_data(EntityColumn, create_list, false, 'id', [], {})
      @entity = Entity.find(params[:id])
      @entity_columns = @entity.entity_columns
    end

    # post domains/:domain_id/entities/:id/generate_views.json
    def generate_views
      viewType = params[:view_type] || 'list'
      detailViewType = params[:detail_view_type] || 'none'
      viewType = 'list-detail' if(detailViewType != 'none' && viewType == 'list')
      runtimeOption = params[:runtime_option] || ''
      skipStore = (params[:skip_store] == 'true' ? 'y' : 'n') || 'n'
      parentMenu = params[:parent_menu] || ''
      commandStr = "rails g hatio_resource_view #{params[:resource_name]} #{runtimeOption} --domain_id=#{params[:domain_id]} --bundle=#{params[:bundle]} --view_type=#{viewType} --detail_view_type=#{detailViewType} --skip_store=#{skipStore} --parent_menu=#{parentMenu}"
      puts commandStr
      run_command(commandStr)
    end
    
    # domains/:domain_id/entities/:id/generate_api.json
    def generate_api
      raise "Empty bundle not allowed!" if (!params[:bundle] || params[:bundle].empty?)
      bundle = params[:bundle]
      idType = params[:id_type] || 'uuid'
      runtimeOption = params[:runtime_option] || ''
      historyOption = (params[:history_option] == 'true' ? 'y' : 'n') || 'n'
      commandStr = "rails g hatio_resource_api #{params[:resource_name]} #{runtimeOption} --id_type=#{idType} --bundle=#{bundle} --history=#{historyOption}"
      puts commandStr
      run_command(commandStr)
    end
    
    # domains/:domain_id/entities/:id/generate_model.json
    def generate_model
      raise "Empty bundle not allowed!" if (!params[:bundle] || params[:bundle].empty?)
      bundle = params[:bundle]
      idType = params[:id_type] || 'uuid'
      runtimeOption = params[:runtime_option] || ''
      commandStr = "rails g hatio_resource_model #{params[:resource_name]} #{runtimeOption} --id_type=#{idType} --bundle=#{bundle}"
      puts commandStr
      run_command(commandStr)
    end
    
    # domains/:domain_id/entities/generate_table.json
    def generate_table
      begin
        output, stdStr, errStr = "", "", ""
        Open3.popen3('rake', 'db:migrate') do |stdin, stdout, stderr, wait_thr|
          stdout.each { |line| stdStr << line }
          stderr.each { |line| errStr << line }
        end
        
        if(stdStr && !stdStr.empty?)
          resultArr = stdStr.split("\n")
          resultStr = resultArr.pop
          successFlag = resultStr.match(/migrated/) ? true : false
          output = successFlag ? stdStr : ((!errStr || errStr.empty?) ? stdStr : errStr)
        else
          sucessFlag = false
          output = (!errStr || errStr.empty?) ? 'There is no migration file to migrate!' : errStr
        end
        
        respond_to do |format|
          format.json { render :json => {:success => true, :result => successFlag, :msg => output} }
        end
      rescue ::Exception => e
        respond_to do |format|
          format.json { render :json => {:success => false, :msg => e.to_s}, :status => 'Invalid command' }
        end
      end
    end
    
    private
    
    def run_command(commandStr)
      begin
        output, stdStr, errStr = "", "", ""
        Open3.popen3(commandStr) do |stdin, stdout, stderr, wait_thr|
          stdout.each { |line| stdStr << line }
          stderr.each { |line| errStr << line }
        end
        
        puts stdStr
        puts errStr
        resultArr = stdStr.split("\n")
        resultStr = resultArr.pop
        successFlag = (resultStr == 'Success') ? true : false
        output = successFlag ? stdStr : ((!errStr || errStr.empty?) ? stdStr : errStr)
        
        respond_to do |format|
          format.json { render :json => {:success => true, :result => successFlag, :msg => output} }
        end
      rescue ::Exception => e
        respond_to do |format|
          format.json { render :json => {:success => false, :msg => e.to_s}, :status => 'Invalid command' }
        end
      end
    end
end
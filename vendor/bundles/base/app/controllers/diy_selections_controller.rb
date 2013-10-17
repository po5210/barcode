class DiySelectionsController < DomainResourcesController
  
  # 일단 테스트 용으로 인증을 하지 않음 --> 추후 제거 
  skip_before_filter :verify_authenticity_token, :authenticate_user!
  
  public
  
    # POST domains/:domain_id/diy_selections/update_multiple.json
    def update_multiple
      delete_list, update_list, create_list = self.refine_multiple_data(params[:multiple_data])
      # 1. delete
      self.destroy_multiple_data(DiySelection, delete_list)
      # 2. update
      self.update_multiple_data(DiySelection, update_list, 'id', ['service_in_params', 'service_out_params'], {})
      # 3. create
      self.create_multiple_data(DiySelection, create_list, true, 'id', ['service_in_params', 'service_out_params'], {})
      
      respond_to do |format|
        format.xml  { render :xml => {:success => true, :msg => 'Success'} }
        format.json { render :json => {:success => true, :msg => 'Success'} }
      end
    end
    
    # POST domains/:domain_id/diy_selections/:diy_selection_id/update_multiple_parameters.json
    def update_multiple_parameters
      @diySelection = DiySelection.find(params[:id])
      parameterType = params[:type]
      parameterResource = (parameterType == 'in') ? ServiceInParam : ServiceOutParam
      self.update_parameters(@diySelection, parameterResource)
      @service_params = (parameterType == 'in') ? @diySelection.service_in_params : @diySelection.service_out_params
    end
    
    def update_parameters(diySelection, parameterResource)
      delete_list, update_list, create_list = self.refine_multiple_data(params[:multiple_data])
      # 1. delete
      self.destroy_multiple_data(parameterResource, delete_list)
      # 2. update
      self.update_multiple_data(parameterResource, update_list, 'id', [], {})
      # 3. create
      self.create_multiple_data(parameterResource, create_list, true, 'id', [], {})
    end
    
    # GET /domains/domain_id/diy_selections/diy_selection_name/shoot
    # GET /domains/domain_id/diy_selections/diy_selection_name/shoot.json
    def query
      shoot
    end
    
    # POST /domains/domain_id/diy_selections/diy_selection_name/shoot
    # POST /domains/domain_id/diy_selections/diy_selection_name/shoot.json
    def shoot
      @domain = Domain.find(params[:domain_id]) unless @domain
      @diy_selection = @domain.diy_selections.find_by_name(params[:id])
      raise Hatio::Exception::ResourceNotFound, "Not Found CustomSelection Named '#{params[:id]}" unless(@diy_selection)

      @error_message, @error_status_code, @result_count = nil, nil, 0
      params[:input] ||= params
      params[:input][:domain_id] = params[:domain_id] if params[:input][:domain_id].blank?
      @result_list = @diy_selection.execute_logic(params[:input])
      
      if('xls' == params[:format])
        @out_params = @diy_selection.service_out_params
        @result_list = @result_list['items'] unless(@result_list['items'].blank?)
      end
      
      respond_to do |format|
        format.html { render :layout => true, :status => @error_status_code ? @error_status_code : "200" }
        format.xml { render :xml => @result_list } 
        format.json { render :json => @result_list }
        format.xls
      end
    end
end

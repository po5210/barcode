class CommonCodesController < DomainResourcesController
  
  skip_before_filter :verify_authenticity_token
  
  # POST /domains/:domain_id/common_codes/:id/update_multiple_codes
  # POST /domains/:domain_id/common_codes/:id/update_multiple_codes.json
  def update_multiple_codes
    common_code = CommonCode.find(params[:id])
    delete_list, update_list, create_list = self.refine_multiple_data(params[:multiple_data])

    CommonCode.transaction do
      # 1. delete
      self.destroy_multiple_data(CommonCode, delete_list)

      # 2. update
      self.update_multiple_data(CommonCode, update_list, 'id', ['parent_id'], {})

      # 3. create
      self.create_multiple_data(CommonCode, create_list, false, 'id', [], {})
    end
    
    respond_to do |format|
      format.xml  { render :xml => {:success => true, :msg => 'Success'} }
      format.json { render :json => {:success => true, :msg => 'Success'} }
    end
  end
  
end

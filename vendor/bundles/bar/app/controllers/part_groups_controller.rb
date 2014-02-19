class PartGroupsController < DomainResourcesController
  
  skip_before_filter :verify_authenticity_token
  
  #
  # POST /domains/:domain_id/invoices/create.json
  #  
  def create
	cnt = 0
	
	if(cnt > 0)
		raise Hatio::Exception::InvalidRequest, "Already exist!"
	else
		create!
	end
  end
  
end

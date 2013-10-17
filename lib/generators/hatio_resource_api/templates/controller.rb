class <%= class_name.pluralize %>Controller < DomainResourcesController
  
  skip_before_filter :verify_authenticity_token
  
end

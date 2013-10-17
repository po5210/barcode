class ServiceOutParam < ActiveRecord::Base
  
    universal_unique_id
    belongs_to :resource, :polymorphic => true
    attr_accessible :resource_type, :resource_id, :name,:description,:table_name,:rank
end

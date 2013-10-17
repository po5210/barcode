class Domain < ActiveRecord::Base
  
  attr_accessible :name, :description, :timezone, :system_flag, :creator_id, :updater_id
  validates_presence_of :name
  validates_uniqueness_of :name, :case_sensitive => false
  
  stampable
  meaningful_id [:name]
  
  def self.system_domain
    Domain.find_by_system_flag(true) || Domain.first
  end
  
  #
  # Pluggable model dinamic loading
  #
  Hatio::PluggableSpot::DOMAIN_MODEL_PLUGGABLES.each do |pluggable_code|
    self.class_eval &pluggable_code
  end
  
end

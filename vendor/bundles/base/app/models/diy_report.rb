class DiyReport < ActiveRecord::Base
  
    stampable
		universal_unique_id
		belongs_to :diy_selection
		attr_accessible :name,:description,:diy_selection_id
		
end

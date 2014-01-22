class PartGroup < ActiveRecord::Base

	stampable
	meaningful_id [:name]
	belongs_to :domain
	attr_accessible :name,:description,:part_desc

end

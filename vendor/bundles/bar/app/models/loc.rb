class Loc < ActiveRecord::Base

	stampable
	meaningful_id [:name]
	belongs_to :domain
	belongs_to :baseloc
	attr_accessible :name,:description,:baseloc_id,:loc_nmk,:prod_line_fg,:erp_bloc,:erp_loc,:tmp_bloc,:tmp_loc,:use_yn

end

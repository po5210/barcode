class BarLocmap < ActiveRecord::Base

	stampable
	meaningful_id [:baseloc_cd, :name]
	belongs_to :domain
	attr_accessible :baseloc_cd,:name,:description,:loc_nmk,:loc_cd,:use_yn,:prod_line_fg,:erp_bloc,:erp_loc,:tmp_bloc,:tmp_loc,:reg_ip,:mod_ip

end

class BarLocmap < ActiveRecord::Base

	stampable
	meaningful_id [:bar_locgrp_id, :name]
	belongs_to :domain
	belongs_to :bar_locgrp
	attr_accessible :bar_locgrp_id,:name,:description,:loc_nmk,:loc_dc,:use_yn,:prod_line_fg,:erp_bloc,:erp_loc,:tmp_bloc,:tmp_loc,:reg_ip,:mod_ip

end

class BarMatout < ActiveRecord::Base

	stampable
	meaningful_id [:domain_id, :name]
	belongs_to :domain
	belongs_to :bar_locgrp
	belongs_to :bar_locmap
	attr_accessible :name,:description,:who_dt,:who_sq,:who_fg,:lot_qty,:lot_rqty,:item_cd,:bar_locgrp_id,:bar_locmap_id,:outbaseloc_cd,:outloc_cd,:created_ip,:updated_ip,:whi_dt,:whi_sq,:lot_no,:ser_no,:internal_issue_no,:26,:27,:28,:29

end

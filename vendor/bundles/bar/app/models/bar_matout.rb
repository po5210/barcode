class BarMatout < ActiveRecord::Base

	stampable
	meaningful_id [:who_dt, :who_sq, :barcode]
	belongs_to :domain
	belongs_to :bar_locgrp
	belongs_to :bar_locmap
	attr_accessible :who_dt,:who_sq,:barcode,:who_fg,:lot_fg,:lot_qty,:lot_rqty,:item_cd,:baseloc_cd,:loc_cd,:outbaseloc_cd,:outloc_cd,:reg_id,:reg_dtm,:mod_id,:mod_dtm,:reg_ip,:mod_ip,:whi_dt,:whi_sq,:lot_no,:ser_no,:dml_method,:erp_if

end

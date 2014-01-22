class BarMatmap < ActiveRecord::Base

	stampable
	meaningful_id [:name, :supplier_id]
	belongs_to :domain
	belongs_to :supplier
	belongs_to :bar_locgrp
	belongs_to :bar_locmap
	attr_accessible :name,:description,:supplier_id,:item_tp,:acct_fg,:odr_fg,:assgwh_cd,:assflc_cd,:qc_fg,:item_nmk,:item_tpk,:use_yn,:str_cd,:str_nm,:unit,:item_gb,:barcode_yn,:box_l,:part_gcd,:box_w,:box_h,:box_qty,:pallet_l,:pallet_w,:pallet_h,:pallet_row,:pallet_column,:pallet_layer,:pallet_bqty,:pallet_qty,:bar_locgrp_id,:bar_locmap_id,:ckdbox_l,:ckdbox_w,:ckdbox_h,:ckdbox_qty,:label_print_fg,:trmain_cd,:model_no,:customer_cd,:assy_hccd_nm,:emp_cd,:cust_tr_cd,:cust_item_cd,:cust_item_nm,:reg_ip,:mod_ip

end

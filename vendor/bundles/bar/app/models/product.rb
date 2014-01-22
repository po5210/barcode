class Product < ActiveRecord::Base

	stampable
	meaningful_id [:name]
	belongs_to :domain
	belongs_to :bar_locgrp
	belongs_to :bar_locmap
	attr_accessible :name,:description,:short_name,:prod_type,:prod_class,:unit,:default_qty,:cycletime,:weight,:waste_cost,:flow_id,:customer_id,:cust_part_no,:erp_ifc_flag,:useless_flag,:acct_fg,:odr_fg,:assgwh_cd,:assflc_cd,:qc_fg,:item_nmk,:item_tpk,:use_yn,:item_gb,:part_gcd,:barcode_yn,:box_l,:box_w,:box_h,:box_qty,:pallet_l,:pallet_h,:pallet_w,:pallet_row,:pallet_column,:pallet_layer,:pallet_bqty,:pallet_qty,:ckdbox_l,:ckdbox_w,:ckdbox_h,:ckdbox_qty,:bar_locgrp_id,:bar_locmap_id,:label_print_fg,:trmain_cd,:model_no,:customer_cd,:assy_hccd_nm,:cust_tr_cd,:cust_item_cd,:cust_item_nm,:item_tp,:eff_start_date,:eff_end_date,:routing

end

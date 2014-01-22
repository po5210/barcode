json.items do |json|
	json.array!(@collection) do |product|
		json.(product, :id,:domain_id,:name,:description,:short_name,:prod_type,:prod_class,:unit,:default_qty,:cycletime,:weight,:waste_cost,:flow_id,:customer_id,:cust_part_no,:erp_ifc_flag,:useless_flag,:creator_id,:updater_id,:created_at,:updated_at,:acct_fg,:odr_fg,:assgwh_cd,:assflc_cd,:qc_fg,:item_nmk,:item_tpk,:use_yn,:item_gb,:part_gcd,:barcode_yn,:box_l,:box_w,:box_h,:box_qty,:pallet_l,:pallet_h,:pallet_w,:pallet_row,:pallet_column,:pallet_layer,:pallet_bqty,:pallet_qty,:ckdbox_l,:ckdbox_w,:ckdbox_h,:ckdbox_qty,:bar_locgrp_id,:bar_locmap_id,:label_print_fg,:trmain_cd,:model_no,:customer_cd,:assy_hccd_nm,:cust_tr_cd,:cust_item_cd,:cust_item_nm,:item_tp,:eff_start_date,:eff_end_date,:routing)
		json.bar_locgrp do
			json.id product.bar_locgrp_id
			json.name product.bar_locgrp ? product.bar_locgrp.name : ''
			json.desc product.bar_locgrp ? product.bar_locgrp.description : ''
		end

		json.bar_locmap do
			json.id product.bar_locmap_id
			json.name product.bar_locmap ? product.bar_locmap.name : ''
			json.desc product.bar_locmap ? product.bar_locmap.description : ''
		end

		end
end
json.total @total_count
json.success true

json.items do |json|
	json.array!(@collection) do |bar_matmap|
		json.(bar_matmap, :id,:domain_id,:name,:description,:supplier_id,:item_tp,:acct_fg,:odr_fg,:assgwh_cd,:assflc_cd,:qc_fg,:item_nmk,:item_tpk,:use_yn,:str_cd,:str_nm,:unit,:item_gb,:barcode_yn,:box_l,:part_gcd,:box_w,:box_h,:box_qty,:pallet_l,:pallet_w,:pallet_h,:pallet_row,:pallet_column,:pallet_layer,:pallet_bqty,:pallet_qty,:bar_locgrp_id,:bar_locmap_id,:ckdbox_l,:ckdbox_w,:ckdbox_h,:ckdbox_qty,:label_print_fg,:trmain_cd,:model_no,:customer_cd,:assy_hccd_nm,:emp_cd,:cust_tr_cd,:cust_item_cd,:cust_item_nm,:creator_id,:updater_id,:created_at,:updated_at,:reg_ip,:mod_ip)
		json.supplier do
			json.id bar_matmap.supplier_id
			json.name bar_matmap.supplier ? bar_matmap.supplier.name : ''
			json.desc bar_matmap.supplier ? bar_matmap.supplier.description : ''
		end
		
		json.bar_locgrp do
			json.id bar_matmap.bar_locgrp_id
			json.name bar_matmap.bar_locgrp ? bar_matmap.bar_locgrp.name : ''
			json.desc bar_matmap.bar_locgrp ? bar_matmap.bar_locgrp.description : ''
		end

		json.bar_locmap do
			json.id bar_matmap.bar_locmap_id
			json.name bar_matmap.bar_locmap ? bar_matmap.bar_locmap.name : ''
			json.desc bar_matmap.bar_locmap ? bar_matmap.bar_locmap.description : ''
		end

		end
end
json.total @total_count
json.success true

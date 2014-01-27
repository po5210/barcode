json.items do |json|
	json.array!(@collection) do |bar_matout|
		json.(bar_matout, :id,:domain_id,:name,:description,:who_dt,:who_sq,:who_fg,:lot_qty,:lot_rqty,:item_cd,:bar_locgrp_id,:bar_locmap_id,:outbaseloc_cd,:outloc_cd,:creator_id,:updater_id,:created_at,:updated_at,:created_ip,:updated_ip,:whi_dt,:whi_sq,:lot_no,:ser_no,:internal_issue_no,:26,:27,:28,:29)
		json.bar_locgrp do
			json.id bar_matout.bar_locgrp_id
			json.name bar_matout.bar_locgrp ? bar_matout.bar_locgrp.name : ''
		end

		json.bar_locmap do
			json.id bar_matout.bar_locmap_id
			json.name bar_matout.bar_locmap ? bar_matout.bar_locmap.name : ''
		end

		end
end
json.total @total_count
json.success true

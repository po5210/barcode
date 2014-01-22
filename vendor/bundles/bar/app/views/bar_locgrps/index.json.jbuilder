json.items do |json|
	json.array!(@collection) do |bar_locgrp|
		json.(bar_locgrp, :id,:domain_id,:name,:description,:baseloc_fg,:div_cd,:inloc_cd,:outloc_cd,:baseloc_nmk,:use_yn,:creator_id,:updater_id,:created_at,:updated_at)
		end
end
json.total @total_count
json.success true

json.items do |json|
	json.array!(@collection) do |bar_locmap|
		json.(bar_locmap, :id,:domain_id,:baseloc_cd,:name,:description,:loc_nmk,:loc_cd,:use_yn,:creator_id,:created_at,:updater_id,:updated_at,:prod_line_fg,:erp_bloc,:erp_loc,:tmp_bloc,:tmp_loc,:reg_ip,:mod_ip)
		end
end
json.total @total_count
json.success true

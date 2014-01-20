json.items do |json|
	json.array!(@collection) do |bar_locmap|
		json.(@loc, :baseloc_cd,:loc_cd,:loc_nm,:loc_nmk,:loc_dc,:use_yn,:reg_id,:reg_dtm,:mod_id,:mod_dtm,:prod_line_fg,:erp_bloc,:erp_loc,:tmp_bloc,:tmp_loc,:reg_ip,:mod_ip)
		end
end
json.total @total_count
json.success true

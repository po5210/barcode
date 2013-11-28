json.items do |json|
	json.array!(@collection) do |loc|
		json.(loc, :id,:domain_id,:name,:description,:baseloc_id,:loc_nmk,:prod_line_fg,:erp_bloc,:erp_loc,:tmp_bloc,:tmp_loc,:use_yn,:creator_id,:updater_id,:created_at,:updated_at)
		json.baseloc do
			json.id loc.baseloc_id
			json.name loc.baseloc ? loc.baseloc.name : ''
		end

		end
end
json.total @total_count
json.success true

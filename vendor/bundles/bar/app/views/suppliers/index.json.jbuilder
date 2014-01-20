json.items do |json|
	json.array!(@collection) do |supplier|
		json.(supplier, :id,:domain_id,:name,:description,:erp_ifc_flag,:creator_id,:updater_id,:created_at,:updated_at,:supply_fg,:reg_nb,:ppl_nb,:ceo_nm,:business,:jongmok,:zip,:div_addr1,:addr2,:ddd,:tel,:fax,:use_yn)
		end
end
json.total @total_count
json.success true

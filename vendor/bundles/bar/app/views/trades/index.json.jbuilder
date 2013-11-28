json.items do |json|
	json.array!(@collection) do |trade|
		json.(trade, :id,:domain_id,:name,:description,:attr_nm,:tr_fg,:reg_nb,:ppl_nb,:ceo_nm,:business,:jongmok,:zip,:div_addr1,:addr2,:ddd,:tel,:fax,:tr_nmk,:attr_nmk,:ceo_nmk,:use_yn,:creator_id,:updater_id,:created_at,:updated_at)
		end
end
json.total @total_count
json.success true

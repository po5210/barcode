json.items do |json|
	json.array!(@collection) do |part_group|
		json.(part_group, :id,:domain_id,:name,:description,:part_desc,:creator_id,:updater_id,:created_at,:updated_at)
		end
end
json.total @total_count
json.success true

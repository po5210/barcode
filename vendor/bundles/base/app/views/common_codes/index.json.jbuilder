json.items do |json|
	json.array!(@collection) do |common_code|
		json.(common_code, :id,:domain_id,:name,:parent_id,:description,:creator_id,:updater_id,:created_at,:updated_at)
		json.creator do
			json.id common_code.creator_id
			json.name common_code.creator_name
		end

		json.updater do
			json.id common_code.updater_id
			json.name common_code.updater_name
		end
	end
end
json.total @total_count
json.success true

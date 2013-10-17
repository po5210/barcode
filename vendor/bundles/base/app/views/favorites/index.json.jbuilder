json.items do |json|
	json.array!(@collection) do |favorite|
  		json.(favorite, :id,:domain_id,:description,:name,:url,:user_id,:user_name,:created_at,:creator_id,:updated_at,:updater_id)
	end
end
json.success true
json.total @total_count
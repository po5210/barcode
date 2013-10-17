json.items do |json|
	json.array!(@collection) do |entity|
		json.(entity, :id,:domain_id,:name,:description,:bundle,:creator_id,:updater_id,:created_at,:updated_at)
		json.creator do
			json.id entity.creator_id
			json.name entity.creator ? entity.creator.name : ''
		end
		json.updater do
			json.id entity.updater_id
			json.name entity.updater ? entity.updater.name : ''
		end
	end
end

json.total @total_count
json.success true

json.items do |json|
	json.array!(@collection) do |role|
  		json.(role, :id,:domain_id,:name,:description,:created_at,:creator_id,:updated_at,:updater_id)

		json.creator_id role.creator_id
		json.updater_id role.updater_id
		
	  	json.creator do
	    	json.id role.creator_id
	    	json.name role.creator_name
	  	end if role.creator
	
	  	json.updater do
	    	json.id role.updater_id
	    	json.name role.updater_name
	  	end if role.updater
	end
end
json.success true
json.total @total_count
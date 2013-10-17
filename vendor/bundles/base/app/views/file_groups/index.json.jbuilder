json.items do |json|
	json.array!(@collection) do |file_group|
  		json.(file_group, :id, :domain_id, :name, :description, :updater_id, :updated_at, :creator_id, :created_at)
		
	  	json.creator do
	    	json.id file_group.creator_id
	    	json.name file_group.creator ? file_group.creator.name : ''
	  	end if file_group.creator

	  	json.updater do
	    	json.id file_group.updater_id
	    	json.name file_group.updater ? file_group.updater.name : ''
	  	end if file_group.updater
	end
end
json.total @total_count
json.success true
json.items do |json|
	json.array!(@collection) do |diy_service|
  		json.(diy_service, :id,:domain_id,:name,:description,:script_type,:active_flag,:service_logic,:atomic_flag,:creator_id,:updater_id,:created_at,:updated_at)
		
	  	json.updater do
	    	json.id diy_service.updater_id
	    	json.name diy_service.updater ? diy_service.updater.name : ''
	  	end if diy_service.updater
	end
end

json.total @total_count
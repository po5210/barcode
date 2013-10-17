json.items do |json|
	json.array!(@collection) do |menu|
  		json.(menu, :id,:name,:description,:domain_id,:auth,:parent_id,:entity_id,:template,:menu_type,:category,:rank,:icon_path,:hidden_flag,:creator_id,:updater_id,:created_at,:updated_at)
	  	json.entity do
	    	json.id menu.entity_id
	    	json.name menu.entity ? menu.entity.name : ''
	  	end if menu.entity
			
	  	json.updater do
	    	json.id menu.updater_id
	    	json.name menu.updater ? menu.updater.name : ''
	  	end if menu.updater
	end
end
json.total @total_count
json.success true
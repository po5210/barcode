json.items do |json|
	json.array!(@collection) do |diy_selection|
  		json.(diy_selection, :id,:domain_id,:name,:description,:script_type,:view_type, :updater_id, :updated_at, :creator_id, :created_at)
		
	  	json.updater do
	    	json.id diy_selection.updater_id
	    	json.name diy_selection.updater ? diy_selection.updater.name : ''
	  	end if diy_selection.updater
	end
end
json.total @total_count
json.success true
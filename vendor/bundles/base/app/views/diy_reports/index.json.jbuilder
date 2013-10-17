json.items do |json|
	json.array!(@collection) do |diy_report|
		json.(diy_report, :id,:domain_id,:name,:description,:diy_selection_id,:creator_id,:updater_id,:created_at,:updated_at)
		json.diy_selection do
			json.id diy_report.diy_selection_id
			json.name diy_report.diy_selection ? diy_report.diy_selection.name : ''
		end
	  	json.creator do
	    	json.id diy_report.creator_id
	    	json.name diy_report.creator ? diy_report.creator.name : ''
	  	end
	  	json.updater do
	    	json.id diy_report.updater_id
	    	json.name diy_report.updater ? diy_report.updater.name : ''
	  	end
	end
end
json.total @total_count
json.success true

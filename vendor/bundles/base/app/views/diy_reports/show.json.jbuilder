json.(@diy_report, :id,:domain_id,:name,:description,:diy_selection_id,:creator_id,:updater_id,:created_at,:updated_at)
json.service_url @diy_report.diy_selection ? @diy_report.diy_selection.get_service_url : ''
json.diy_selection do
	json.id @diy_report.diy_selection_id
	json.name @diy_report.diy_selection ? @diy_report.diy_selection.name : ''
end
json.service_in_params @diy_report.diy_selection.service_in_params, :name, :description, :rank if @diy_report.diy_selection
json.service_out_params @diy_report.diy_selection.service_out_params, :name, :description, :table_name, :rank if @diy_report.diy_selection

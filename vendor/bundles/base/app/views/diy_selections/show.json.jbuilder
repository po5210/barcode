json.(@diy_selection, :id,:domain_id,:name,:description,:script_type,:view_type,:service_logic,:creator_id,:updater_id,:created_at,:updated_at)
json.service_in_params @diy_selection.service_in_params, :id, :resource_type, :resource_id, :name, :description, :rank
json.service_out_params @diy_selection.service_out_params, :id, :resource_type, :resource_id, :name, :description, :table_name, :rank

json.(@diy_service, :id,:domain_id,:name,:description,:script_type,:active_flag,:service_logic,:atomic_flag,:creator_id,:updater_id,:created_at,:updated_at)
json.service_in_params @diy_service.service_in_params, :id, :resource_type, :resource_id, :name, :description, :rank
json.service_out_params @diy_service.service_out_params, :id, :resource_type, :resource_id, :name, :description, :table_name, :rank

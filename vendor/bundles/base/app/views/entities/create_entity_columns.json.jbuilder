json.items do |json|
	json.array!(@entity_columns) do |entity_column|
  		json.(entity_column,:id,:entity_id, :name,:description,:pk,:column_type,:ref_type,:ref_name,:editable,:list_rank,:search_rank,:sort_rank,:display_rank,:reverse_sort)
	end
end

json.success true
json.total @entity_columns.length
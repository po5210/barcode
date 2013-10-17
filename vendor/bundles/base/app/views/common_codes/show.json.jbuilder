@codes = @common_code.codes
json.(@common_code, :id, :name, :description)
json.items do |json|
	json.array!(@codes) do |json, code|
  		json.(code, :id,:name,:description)
	end
end
json.success true
json.total @codes.count
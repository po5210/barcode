json.items do |json|
	json.array!(@users) do |user|
  		json.(user, :id,:login,:name,:email,:admin_flag,:default_domain_id,:lang,:timezone,:dept,:operator_flag,:updated_at)
	end
end
json.success true
json.total @total_count
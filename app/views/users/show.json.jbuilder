json.(@user, :id,:login,:name,:email,:admin_flag,:default_domain_id,:lang,:timezone,:password,:operator_flag,:dept)
json.default_domain do
	json.id @user.default_domain_id
	json.name @user.default_domain ? @user.default_domain.name : ''
end

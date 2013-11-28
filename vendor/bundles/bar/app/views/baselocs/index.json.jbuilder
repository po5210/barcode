json.items do |json|
	json.array!(@collection) do |baseloc|
		json.(baseloc, :id,:domain_id,:name,:description,:baseloc_fg,:div_cd,:inloc_cd,:outloc_cd,:baseloc_nmk,:use_yn)
		end
end
json.total @total_count
json.success true

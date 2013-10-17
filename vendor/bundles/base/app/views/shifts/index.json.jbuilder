json.items do |json|
	json.array!(@collection) do |shift|
		json.(shift, :id,:domain_id,:total_shift,:shift1_start,:shift2_start,:shift3_start,:shift1_end,:shift2_end,:shift3_end)
	end
end
json.total @total_count
json.success true

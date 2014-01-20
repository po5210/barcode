puts "Barcode Common Code creating..."

CommonCode.setup domain, :USE_YN, {:description => 'Use Y/N'} do
  code 'Y' => 'Yes'
  code 'N' => 'No'
end

puts "Barcode Common Code created..."
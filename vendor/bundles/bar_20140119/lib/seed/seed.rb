debug_print "Loading [Barcode data] bundle data loading..."

Dir[File.join(File.dirname(__FILE__), 'build', '*.rb')].sort.each do |build_file|
  load build_file
end

puts "Completed to load [Barcode data] bundle data!"
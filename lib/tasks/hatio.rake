namespace :hatio do
  desc "Detect mismatching tags javascript files"
  
  task :detect_mismatch_tags do
    require 'utils/detect_mismatch_tags'

    unless ENV.include?("tags")
      raise "usage: rake hatio:detect_mismatch_tags tags='{,[,('" 
    end

    tags = ENV['tags']

    puts "tags : #{tags}"
    
    find_mismatches tags
  end
  
  desc "Load Seed - rake hatio:load_seed[bundle, src_file_name]"
  
  task :load_seed, [:bundle, :src_file_name] => :environment do |t, args|
    src_file_name = args.src_file_name
    bundle = args.bundle
    puts "Start to load #{bundle}, #{src_file_name} file ...."
    load "#{Rails.root}/vendor/bundles/#{bundle}/lib/seed/#{src_file_name}"
    puts "Completed to load seed!"
  end
  
  desc "Convert csv file to json - rake hatio:csv_to_json[source_file_path,destination_file_path]"
  
  task :csv_to_json, [:src_file_path, :dest_file_path] => :environment do |t, args|
    src_file_path = args.src_file_path
    dest_file_path = args.dest_file_path
    puts src_file_path
    puts dest_file_path
    json_data_list = []
    headers = []
    separator = ','
    data_count = 0
    index = 0
    
    File.open(src_file_path, 'r').each do |line|
      if index == 0
        # 첫 번째 라인은 헤더 정보 
        headers = line.strip.split(separator).collect{ |header| header.strip.downcase }
      else
        # 두 번째 이상 부터는 데이터 
        next if line.strip.empty?
        next if line.strip.starts_with? '#'
        seq = -1
        json_data = {}
        values = line.split(separator).collect do |v| 
          seq += 1
          json_data[headers[seq]] = v.strip
        end
        json_data_list << json_data
        data_count += 1
      end
      index += 1
    end
    
    debug_print "Total #{data_count} count loaded!"
    
    File.open(dest_file_path, "w") do |f|
      f.write  ActiveSupport::JSON.encode(json_data_list)
    end
  end

  # db:migrate ==> error Not found schema_migrations...  
  desc "Hatio db migrate"
  
  task :db_migrate => [:environment, 'db:migrate']
  
  desc "Hatio db reset"
  
  task :db_reset => [:environment, 'db:reset']
  
  desc "Hatio db schema load"
  
  task :db_schema_load => [:environment, 'db:schema:load']

  desc "Reset database, tables and data!"
  
  task :reset => [:environment, 'db:drop', 'db:create', 'db:migrate', 'hatio:load_data']
  
  desc "Create database, tables and load initial data!"
  
  task :setup => [:environment, :setup_dbconfig, 'db:create', 'db:migrate', 'hatio:load_data']
  
  desc "Migrate db and data"
  
  task :migrate => [:environment, 'db:migrate', 'hatio:load_data']
  
  desc "Load initial data"
  
  task :load_data => :environment do
    debug_print "Start to load inital data ...."
    
    Hatio::Bundle.ordered_bundle_list.each do |bundle|
      seed = "#{Rails.root}/vendor/bundles/#{bundle.name}/lib/seed/seed.rb"
      load seed if seed
    end
    
    debug_print "Completed to load inital data!"
  end
  
  task :upload_locale => :environment do
    require 'utils/upload_locale'

    upload_locale
  end
  
end

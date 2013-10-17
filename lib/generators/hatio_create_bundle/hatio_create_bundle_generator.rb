class HatioCreateBundleGenerator < Rails::Generators::NamedBase
  
  source_root File.expand_path('../templates', __FILE__)
  class_option :bundle_name, :type => :string, :default => '', :desc => "bundle name"
  class_option :dependency, :type => :string, :default => '', :description => "dependency bundle"
  APP_BUNDLE_PATH = File.join(Rails.root, "/vendor/bundles")
  CLIENT_BUNDLE_PATH = File.join(Rails.root, "/public/bundle")
  
  def generate_bundle
    
    begin
      raise "Bundle name is empty!" unless(class_name)
      @bundle_name = "#{class_name.downcase}"
      puts "Generate #{@bundle_name} server bundle...."
      @dependency_bundle = options.dependency
      puts "Dependency bundle - #{@dependency_bundle}"
      
      # CREATE SERVER BUNDLE
      empty_directory "#{APP_BUNDLE_PATH}" unless File.exist?(APP_BUNDLE_PATH)
      empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}" unless File.exist?("#{APP_BUNDLE_PATH}/#{@bundle_name}")
      
      empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/app" unless File.exist?("#{APP_BUNDLE_PATH}/#{@bundle_name}/app")
      empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/app/controllers" unless File.exist?("#{APP_BUNDLE_PATH}/#{@bundle_name}/app/controllers")
      empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/app/models" unless File.exist?("#{APP_BUNDLE_PATH}/#{@bundle_name}/app/models")
      empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/app/helpers" unless File.exist?("#{APP_BUNDLE_PATH}/#{@bundle_name}/helpers")
      empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/app/views" unless File.exist?("#{APP_BUNDLE_PATH}/#{@bundle_name}/views")
      
      empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/config" unless File.exist?("#{APP_BUNDLE_PATH}/#{@bundle_name}/config")
      empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/config/locales" unless File.exist?("#{APP_BUNDLE_PATH}/#{@bundle_name}/config/locales")
      
      empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/db" unless File.exist?("#{APP_BUNDLE_PATH}/#{@bundle_name}/db")
      empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/db/migrate" unless File.exist?("#{APP_BUNDLE_PATH}/#{@bundle_name}/db/migrate")
      
      empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/lib" unless File.exist?("#{APP_BUNDLE_PATH}/#{@bundle_name}/lib")
      empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/lib/seed" unless File.exist?("#{APP_BUNDLE_PATH}/#{@bundle_name}/lib/seed")
      empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/lib/#{@bundle_name}" unless File.exist?("#{APP_BUNDLE_PATH}/#{@bundle_name}/lib/#{@bundle_name}")
      
      empty_directory "#{APP_BUNDLE_PATH}/#{@bundle_name}/test" unless File.exist?("#{APP_BUNDLE_PATH}/#{@bundle_name}/test")      
              
      template "init.rb", "#{APP_BUNDLE_PATH}/#{@bundle_name}/lib/init.rb"
      template "lib_bundle.rb", "#{APP_BUNDLE_PATH}/#{@bundle_name}/lib/#{@bundle_name}.rb"
      template "version.rb", "#{APP_BUNDLE_PATH}/#{@bundle_name}/lib/#{@bundle_name}/version.rb"
      template "pluggable_spot.rb", "#{APP_BUNDLE_PATH}/#{@bundle_name}/lib/#{@bundle_name}/pluggable_spot.rb"
      
      template "routes.rb", "#{APP_BUNDLE_PATH}/#{@bundle_name}/config/routes.rb"
      template "en-US.yml", "#{APP_BUNDLE_PATH}/#{@bundle_name}/config/locales/en-US.yml"
      template "ko-KR.yml", "#{APP_BUNDLE_PATH}/#{@bundle_name}/config/locales/ko-KR.yml"
      template "zh-CN.yml", "#{APP_BUNDLE_PATH}/#{@bundle_name}/config/locales/zh-CN.yml"
      template "seed.rb", "#{APP_BUNDLE_PATH}/#{@bundle_name}/lib/seed/seed.rb"
      
      template "task.rake", "#{APP_BUNDLE_PATH}/#{@bundle_name}/lib/tasks/#{@bundle_name}.rake"
      template "Gemfile", "#{APP_BUNDLE_PATH}/#{@bundle_name}/Gemfile"
      template "Rakefile", "#{APP_BUNDLE_PATH}/#{@bundle_name}/Rakefile"
      template "gemspec", "#{APP_BUNDLE_PATH}/#{@bundle_name}/#{@bundle_name}.gemspec"
      template "LICENSE.txt", "#{APP_BUNDLE_PATH}/#{@bundle_name}/LICENSE.txt"
      template "README.md", "#{APP_BUNDLE_PATH}/#{@bundle_name}/README.md"
      
      template "test_helper.rb", "#{APP_BUNDLE_PATH}/#{@bundle_name}/test/test_helper.rb"
      template "test.rb", "#{APP_BUNDLE_PATH}/#{@bundle_name}/test/#{@bundle_name}_test.rb"
      puts "Server bundle #{@bundle_name} generated!"
      
      puts "Generate #{@bundle_name} client bundle...."
      empty_directory "#{CLIENT_BUNDLE_PATH}" unless File.exist?(CLIENT_BUNDLE_PATH)
      empty_directory "#{CLIENT_BUNDLE_PATH}/#{@bundle_name}" unless File.exist?("#{CLIENT_BUNDLE_PATH}/#{@bundle_name}")
      
      empty_directory "#{CLIENT_BUNDLE_PATH}/#{@bundle_name}/controller" unless File.exist?("#{CLIENT_BUNDLE_PATH}/#{@bundle_name}/controller")
      empty_directory "#{CLIENT_BUNDLE_PATH}/#{@bundle_name}/model" unless File.exist?("#{CLIENT_BUNDLE_PATH}/#{@bundle_name}/model")
      empty_directory "#{CLIENT_BUNDLE_PATH}/#{@bundle_name}/store" unless File.exist?("#{CLIENT_BUNDLE_PATH}/#{@bundle_name}/store")
      empty_directory "#{CLIENT_BUNDLE_PATH}/#{@bundle_name}/view" unless File.exist?("#{CLIENT_BUNDLE_PATH}/#{@bundle_name}/view")
      empty_directory "#{CLIENT_BUNDLE_PATH}/#{@bundle_name}/mixin" unless File.exist?("#{CLIENT_BUNDLE_PATH}/#{@bundle_name}/mixin")
      empty_directory "#{CLIENT_BUNDLE_PATH}/#{@bundle_name}/locale" unless File.exist?("#{CLIENT_BUNDLE_PATH}/#{@bundle_name}/locale")
      
      template "en-US.js", "#{CLIENT_BUNDLE_PATH}/#{@bundle_name}/locale/en-US.js"
      template "ko-KR.js", "#{CLIENT_BUNDLE_PATH}/#{@bundle_name}/locale/ko-KR.js"
      template "zh-CN.js", "#{CLIENT_BUNDLE_PATH}/#{@bundle_name}/locale/zh-CN.js"
      template "Controller.js", "#{CLIENT_BUNDLE_PATH}/#{@bundle_name}/controller/#{class_name}Controller.js"
      puts "Client bundle #{@bundle_name} generated!"
      
      puts "Success"
    rescue StandardError => e
      puts "\nError : #{e}"
    end
  end
  
end

require File.expand_path('../boot', __FILE__)

require 'rails/all'

if defined?(Bundler)
  # If you precompile assets before deploying to production, use this line
  Bundler.require(*Rails.groups(:assets => %w(development test)))
  # If you want your assets lazily compiled in production, use this line
  # Bundler.require(:default, :assets, Rails.env)
end

require 'carrierwave/orm/activerecord'

require 'log4r'
require 'log4r/yamlconfigurator'
require 'log4r/outputter/rollingfileoutputter'
include Log4r

module Hatio
  class Application < Rails::Application

    if(Rails.env == 'production')
      log4r_config= YAML.load_file(File.join(File.dirname(__FILE__),"log4r.yml"))
      YamlConfigurator.decode_yaml( log4r_config['log4r_config'] )
      config.logger = Log4r::Logger[Rails.env]
    end

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Custom directories with classes and modules you want to be autoloadable.
    #config.routes.load_paths += %W(#{config.root}/../vendor/base/config)
    
    # Only load the plugins named here, in the order given (default is alphabetical).
    # :all can be used as a placeholder for all plugins not explicitly named.
    # config.plugins = [ :exception_notification, :ssl_requirement, :all ]

    # Activate observers that should always be running.
    # config.active_record.observers = :cacher, :garbage_collector, :forum_observer

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    # Configure the default encoding used in templates for Ruby 1.9.
    config.encoding = "utf-8"

    # Configure sensitive parameters which will be filtered from the log file.
    config.filter_parameters += [:password]

    # Enable escaping HTML in JSON.
    config.active_support.escape_html_entities_in_json = true

    # Use SQL instead of Active Record's schema dumper when creating the database.
    # This is necessary if your schema can't be completely dumped by the schema dumper,
    # like if you have constraints or database-specific column types
    # config.active_record.schema_format = :sql

    # Enforce whitelist mode for mass assignment.
    # This will create an empty whitelist of attributes available for mass-assignment for all models
    # in your app. As such, your models will need to explicitly whitelist or blacklist accessible
    # parameters by using an attr_accessible or attr_protected declaration.
    config.active_record.whitelist_attributes = true

    # Enable the asset pipeline
    config.assets.enabled = true

    # Version of your assets, change this if you want to expire all your assets
    config.assets.version = '1.0'
    
    config.assets.initialize_on_precompile = false
    
    config.assets.precompile += ['session.css', 'std.js', 'std.css', 'ops.js', 'ops.css', 'chart.js', 'chart.css', 'web-socket/web_socket.js']
    
    config.active_record.default_timezone = :local
    # config.active_record.default_timezone = :utc
    
    config.colorize_logging = false
    
    config.to_prepare do
      Devise::SessionsController.layout "session" 
    end
  end
end

Dir["#{Rails.root}/vendor/bundles/*"].each do |bundle|
  Hatio::Application.paths["lib"] << "#{bundle}/lib"
  Hatio::Application.paths["lib/tasks"] << "#{bundle}/lib/tasks"
  Hatio::Application.paths["config"] << "#{bundle}/config"
  Hatio::Application.paths["config/initializers"] << "#{bundle}/config/initializers"
  Hatio::Application.paths["config/locales"] << "#{bundle}/config/locales"
  Hatio::Application.paths["db"] << "#{bundle}/db"
  Hatio::Application.paths["db/migrate"] << "#{bundle}/db/migrate"
  Hatio::Application.paths["db/seeds"] << "#{bundle}/db/seeds.rb"
  Hatio::Application.paths["config/routes"] << "#{bundle}/config/routes.rb"
  Hatio::Application.paths["app"] << "#{bundle}/app"
  Hatio::Application.paths["app/models"] << "#{bundle}/app/models"
  Hatio::Application.paths["app/controllers"] << "#{bundle}/app/controllers"
  Hatio::Application.paths["app/helpers"] << "#{bundle}/app/helpers"
  Hatio::Application.paths["app/views"] << "#{bundle}/app/views"
end
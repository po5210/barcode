source 'https://rubygems.org'

gem 'rails', '3.2.8'

# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'

platforms :ruby do
  gem 'sqlite3'
  #gem 'therubyracer'
  gem 'libv8', '~> 3.11.8'
end

platforms :jruby do
  gem 'activerecord-jdbc-adapter', '1.2.5'
  gem 'activerecord-oracle_enhanced-adapter', '1.4.1'
  gem 'jruby-openssl'
  gem 'therubyrhino', '2.0.2'
  gem 'therubyrhino_jar', '1.7.3'
  gem 'torquebox-messaging', '<= 2.3.2'
  gem 'ruby-plsql'
end

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails',   '~> 3.2.3'
  gem 'coffee-rails', '~> 3.2.1'
  gem 'therubyracer', :platform => :ruby
  # See https://github.com/sstephenson/execjs#readme for more supported runtimes
  gem 'less-rails'
  gem 'uglifier', '>= 1.0.3'
  gem 'jquery-fileupload-rails'
end

gem 'jquery-rails'
gem "devise", "<= 2.2.8"
gem "uuidtools", "~> 2.1.3"
gem 'inherited_resources'
gem 'thor'
gem 'daemons'
gem 'mail'
gem 'roo', "1.10.1"

# To use ActiveModel has_secure_password
# gem 'bcrypt-ruby', '~> 3.0.0'

# To use Jbuilder templates for JSON
gem 'jbuilder'

# Use unicorn as the app server
# gem 'unicorn'

# Deploy with Capistrano
# gem 'capistrano'

# To use debugger
# gem 'debugger'

gem 'carrierwave'
gem 'log4r'
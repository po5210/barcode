require 'hatio'

# Bundle loading

Dir["#{Rails.root}/vendor/bundles/*/lib/init.rb"].each do |initializer|
  load initializer
end

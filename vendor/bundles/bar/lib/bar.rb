require "bar/version"
require "bar/pluggable_spot"

module Bar
  # Your code goes here...
end


Hatio::Bundle.new 'bar',1.0 do |bundle|
  bundle.dependencies = ['base']
end
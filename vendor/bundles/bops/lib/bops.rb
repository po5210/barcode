require "bops/version"
require "bops/pluggable_spot"

module Bops
  # Your code goes here...
end

Hatio::Bundle.new 'bops',1.0 do |bundle|
  bundle.dependencies = ['bar']
end
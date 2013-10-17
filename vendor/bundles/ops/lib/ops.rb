require "ops/version"
require "ops/pluggable_spot"

module Ops
  # Your code goes here...
end

Hatio::Bundle.new 'ops', 1.0 do |bundle|
  bundle.dependencies = ['prod']
end
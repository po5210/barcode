require "<%= @bundle_name %>/version"
require "<%= @bundle_name %>/pluggable_spot"

module <%= class_name %>
  # Your code goes here...
end
<% if(@dependency_bundle && @dependency_bundle.size > 1) %>
Hatio::Bundle.new '<%= @bundle_name %>', 1.0 do |bundle|
  bundle.dependencies = ['<%= @dependency_bundle %>']
end
<% end %>
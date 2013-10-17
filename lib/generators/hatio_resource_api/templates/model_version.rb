class <%= class_name %>Version < ActiveRecord::Base
<%= HatioModelUtil.generateVersionModelBody(singular_name, options, @attributes) %>
end

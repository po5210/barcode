class <%= class_name %> < ActiveRecord::Base
    <%= HatioModelUtil.generateModelBody(options, @attributes) %>
end

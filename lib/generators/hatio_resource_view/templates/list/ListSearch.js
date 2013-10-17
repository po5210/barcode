Ext.define('<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>Search', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : '<%= @bundle.downcase %>_<%= singular_name %>_search',
		
	<%= HatioResourceViewUtil.generateSearchItems(@domain, class_name, @columns, nil, nil) %>
	
});
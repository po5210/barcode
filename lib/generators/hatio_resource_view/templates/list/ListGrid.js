Ext.define('<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>List', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : '<%= @bundle.downcase %>_<%= singular_name %>_list',
		
	store : '<%= @bundle %>.store.<%= class_name %>',
	
	useDetailBtn : <%= (@option_params.detail_view_type && @option_params.detail_view_type == 'popup') ? false : true %>,
	
	<%= HatioResourceViewUtil.generateGrid(@domain, singular_name, @columns, nil, nil) %>,
	
	dockedItems: [ {
		xtype: 'controlbar',
		items : <%= HatioResourceViewUtil.generateGridButtons(@option_params.detail_view_type) %>
	} ]
});
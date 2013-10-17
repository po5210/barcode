Ext.define('<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>Form', {
	
	extend : 'Ext.form.Panel',
	
	xtype : '<%= @bundle.downcase %>_<%= singular_name %>_form',
		
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	<%= HatioResourceViewUtil.generateForm(@domain, "#{singular_name}", @columns, options, "\t\t") %>,

	dockedItems: [ {
		xtype: 'controlbar',
		items : <%= HatioResourceViewUtil.generateFormButtons(@option_params.view_type, @option_params.detail_view_type) %>
	} ]
});
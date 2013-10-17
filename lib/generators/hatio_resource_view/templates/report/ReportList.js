Ext.define('<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>List', {
	
	extend : 'Base.abstract.entity.ReportGridView',
	
	xtype : '<%= @bundle.downcase %>_<%= singular_name %>_list',
	
	useCheckBox : false,
		
	store : '<%= @bundle %>.store.<%= class_name %>',
	
	<%= HatioReportViewUtil.generateColumns(@domain, @out_params) %>
});
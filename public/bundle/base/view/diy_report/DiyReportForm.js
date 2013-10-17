Ext.define('Base.view.diy_report.DiyReportForm', {
	
	extend : 'Ext.form.Panel',
	
	requires : 'Base.store.DiySelection',
	
	xtype : 'base_diy_report_form',
	
	title : T('title.details'),
	
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id'), hidden : true },
		{ name : 'domain_id', value : login.current_domain_id, hidden : true },
		{ name : 'name', fieldLabel : T('label.name') },
		{ name : 'description', fieldLabel : T('label.description') },
		{ name : 'diy_selection', fieldLabel : T('title.diy_selection'), xtype : 'entityfield', storeClass : 'Base.store.DiySelection' },
		{ xtype : 'datefield', name : 'created_at', disabled : true, fieldLabel : T('label.created_at'), format : T('format.datetime') },
		{ xtype : 'datefield', name : 'updated_at', disabled : true, fieldLabel : T('label.updated_at'), format : T('format.datetime') }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'back', 'generate_view', 'save', 'delete']
	} ]
	
});
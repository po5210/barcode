Ext.define('Base.view.diy_selection.DiySelectionForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'base_diy_selection_form',
	
	title : T('title.details'),
	
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id'), hidden : true },
		{ name : 'domain_id', value : login.current_domain_id, hidden : true },
		{ itemId : 'form_name', name : 'name', fieldLabel : T('label.name'), readOnly : true },
		{ name : 'description', fieldLabel : T('label.description') },
		{ name : 'script_type', fieldLabel : T('label.script_type'), xtype : 'codecombo', commonCode : 'SCRIPT_TYPE' },
		{ name : 'view_type', fieldLabel : T('label.view_type'), xtype : 'codecombo', commonCode : 'VIEW_TYPE' },
		{ name : 'service_logic', fieldLabel : T('label.service_logic'), xtype : 'textareafield', rows : 50 },
		{ xtype : 'datefield', name : 'created_at', disabled : true, fieldLabel : T('label.created_at'), format : T('format.datetime') },
		{ xtype : 'datefield', name : 'updated_at', disabled : true, fieldLabel : T('label.updated_at'), format : T('format.datetime') }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'back', 'save', 'delete']
	} ]
	
});
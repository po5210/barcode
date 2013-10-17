Ext.define('Base.view.diy_service.DiyServiceForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'base_diy_service_form',
	
	title : T('title.details'),
	
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id'), hidden : true },
		{ name : 'domain_id', value : login.current_domain_id, hidden : true },
		{ name : 'name', fieldLabel : T('label.name'), readOnly : true },
		{ name : 'description', fieldLabel : T('label.description') },
		{ name : 'script_type', fieldLabel : T('label.script_type'), xtype : 'codecombo', commonCode : 'SCRIPT_TYPE' },
		{ name : 'active_flag', fieldLabel : T('label.active_flag'), xtype : 'checkboxfield', inputValue : true },
		{ name : 'atomic_flag', fieldLabel : T('label.atomic_flag'), xtype : 'checkboxfield', inputValue : true },
		{ name : 'service_logic', fieldLabel : T('label.service_logic'), xtype : 'textareafield', rows : 36 }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'back', 'save', 'delete']
	} ]
});
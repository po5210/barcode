Ext.define('Base.view.domain.DomainForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'base_domain_form',
	
	title : T('title.details'),
	
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id'), hidden : true },
		{ name : 'name', fieldLabel : T('label.name'), readOnly : true },
		{ name : 'description', fieldLabel : T('label.description') },
		{ 
			name : 'timezone', 
			fieldLabel : T('label.timezone'), 
			xtype: 'combo',
			store: 'Timezone',
			queryMode: 'local',
			displayField: 'display',
			valueField: 'value'
		},
		{ name : 'system_flag', fieldLabel : T('label.system_domain'), xtype : 'checkboxfield', readOnly : true, inputValue : true }
		// { xtype : 'datefield', name : 'created_at', disabled : true, fieldLabel : T('label.created_at'), format : T('format.datetime') },
		// { xtype : 'datefield', name : 'updated_at', disabled : true, fieldLabel : T('label.updated_at'), format : T('format.datetime') }
	]
});
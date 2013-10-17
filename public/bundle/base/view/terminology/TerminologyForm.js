Ext.define('Base.view.terminology.TerminologyForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'base_terminology_form',
		
	autoScroll : true,
	
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	
	items: [
		{ name : 'id', fieldLabel : T('label.id'), xtype : 'textfield', hidden : true },
		{ name : 'domain_id', value : login.current_domain_id, xtype : 'textfield', hidden : true },
		{ xtype : 'textfield', name : 'name', fieldLabel : T('label.code'), allowBlank : false, maxLength : 64 },
		{ xtype : 'textfield', name : 'description', fieldLabel : T('label.description'), maxLength : 85 },
		{ 
			xtype: 'container',
			layout: {
				type: 'hbox',
				align : 'stretch'
			},
			items : [ { 
				fieldLabel : T('label.locale'), 
				name : 'locale', 
				flex : 1,
				xtype : 'codecombo', 
				commonCode : 'LANGUAGE',
				allowBlank : false
			}, { 
				name : 'category', 
				fieldLabel : T('label.category'), 
				flex : 1,
				xtype : 'codecombo',
				commonCode : 'TERMS_CATEGORY',
				allowBlank : false,
				padding : '0 0 0 30'
			} ]
		},
		{ xtype : 'textarea', name : 'display', fieldLabel : T('label.display'), flex : 1, padding : '10 0 0 0' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'save', 'close']
	} ]
});
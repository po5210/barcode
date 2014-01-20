Ext.define('Bar.view.instock.InstockForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'bar_instock_form',
	
	cls : 'formBorder',
		
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
	{ 
		xtype: 'container',
		layout: 'hbox',
		items : [ {
			xtype: 'container',
			flex : 1,
			layout : 'anchor',
			defaults: {
				anchor : '90%'
			},
		    items: [
				{ 
					fieldLabel : T('label.product'), 
					name : 'product', 
					xtype : 'textfield', 
					allowBlank : false 
				},
				{ 
					name : 'lot_size', 
					fieldLabel : T('label.lot_size'),
					xtype : 'numberfield'
				}
			]
		}, {
			xtype: 'container',
			flex : 1,
			layout : 'anchor',
			defaults: {
				anchor : '90%'
			},
			items: [
				{ 
					fieldLabel : T('label.unit_price'), 
					name : 'unit_price', 
					xtype : 'numberfield' 
				},
				{ 
					fieldLabel : T('label.qty'), 
					name : 'qty', 
					xtype : 'numberfield' 
				}
			]
		} ]
	}		
	],

	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'new', 'delete', 'save']
	} ]
});
Ext.define('Bar.view.invoice.InvoiceForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'bar_invoice_form',
			
	autoScroll : true,
		
	items : [ {
		xtype : 'fieldset',
		title: 'Details',
		collapsible : false,
		items: [ { 
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
						xtype : 'entitycombo', 
						customSelectionUrl : '/domains/' + login.current_domain_id + '/diy_selections/SelectBarItems/query.json',
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
				items: [ { 
					fieldLabel : T('label.unit_price'), 
					name : 'unit_price', 
					xtype : 'numberfield' 
				}, { 
					fieldLabel : T('label.qty'), 
					name : 'qty', 
					xtype : 'numberfield' 
				} ]
			} ]
		} ]
	} ],

	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'new', 'delete', 'save']
	} ]
});
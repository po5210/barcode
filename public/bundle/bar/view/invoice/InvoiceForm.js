Ext.define('Bar.view.invoice.InvoiceForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'bar_invoice_form',

	dockedItems : [ {
		xtype : 'controlbar',
		items : ['->', 'input', 'new', 'save', 'delete']
	} ]
});
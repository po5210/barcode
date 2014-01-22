Ext.define('Bar.view.invoice_test.InvoiceTestForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'bar_invoice_test_form',

	dockedItems : [ {
		xtype : 'controlbar',
		items : ['->', 'input', 'new', 'save', 'delete']
	} ]
});
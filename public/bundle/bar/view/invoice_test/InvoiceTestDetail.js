Ext.define('Bar.view.invoice_test.InvoiceTestDetail', {
	
	extend : 'Base.abstract.Popup',
	
 	requires : [ 
		'Bar.view.invoice_test.InvoiceTestForm'
	],
	
	xtype : 'bar_invoice_test_detail',
	
	height : 560,
	
	title : T('menu.InvoiceTest'),
		
	items : [ {
		xtype : 'bar_invoice_test_form'
	} ],
	
	setRecord : function(record) {
		this.record = record;
		this.down('form').loadRecord(this.record);
	},
	
	getRecord : function() {
		return this.record;
	}
});
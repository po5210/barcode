Ext.define('Bar.view.invoice.InvoiceDetail', {
	
	extend : 'Base.abstract.Popup',
	
 	requires : [ 
		'Bar.view.invoice.InvoiceForm'
	],
	
	xtype : 'bar_invoice_detail',
	
	height : 560,
	
	title : T('menu.Invoice'),
		
	items : [ {
		xtype : 'bar_invoice_form'
	} ],
	
	setRecord : function(record) {
		this.record = record;
		this.down('form').loadRecord(this.record);
	},
	
	getRecord : function() {
		return this.record;
	}
});
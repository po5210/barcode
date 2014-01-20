Ext.define('Bar.view.invoice.Invoice', {
	
	extend: 'Base.abstract.Panel',
	
	xtype : 'bar_invoice',
	
 	requires : [ 
		'Bar.view.invoice.InvoiceSearch',
		'Bar.view.invoice.InvoiceList',
		'Bar.view.invoice.InvoiceForm'
	],
		
	title : T('menu.Invoice'),
	
	layout : { type : 'vbox', align : 'stretch' },
	
	searchView : 'bar_invoice_search',
	
	gridView : 'bar_invoice_list',
	
	subView : 'bar_invoice_form',
	
	initComponent : function() {

		this.callParent(arguments);
		
		this.add({
			xtype : this.subView
		});
			
		this.add({
			xtype : 'splitter',
			collapsible : false
		});			
		this.add({
			xtype : this.gridView,
			flex : 1
		});
	}
});
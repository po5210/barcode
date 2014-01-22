Ext.define('Bar.view.invoice_test.InvoiceTest', {
	
	extend: 'Base.abstract.Panel',
	
	xtype : 'bar_invoice_test',
	
 	requires : [ 
		'Bar.view.invoice_test.InvoiceTestSearch',
		'Bar.view.invoice_test.InvoiceTestList',
		'Bar.view.invoice_test.InvoiceTestForm'
	],
		
	title : T('menu.InvoiceTest'),
	
	layout : { type : 'vbox', align : 'stretch' },
	
	searchView : 'bar_invoice_test_search',
	
	gridView : 'bar_invoice_test_list',
	
	subView : 'bar_invoice_test_form',
	
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
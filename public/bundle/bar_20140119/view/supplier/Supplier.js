Ext.define('Bar.view.supplier.Supplier', {
	
	extend: 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'Bar.view.supplier.SupplierSearch',
		'Bar.view.supplier.SupplierList'
	],
	
	xtype : 'bar_supplier',
	
	title : T('menu.Supplier'),
	
	searchView : 'bar_supplier_search',
	
	gridView : 'bar_supplier_list'
	
});
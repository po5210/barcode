Ext.define('Bar.view.product.Product', {
	
	extend: 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'Bar.view.product.ProductSearch',
		'Bar.view.product.ProductList'
	],
	
	xtype : 'bar_product',
	
	title : T('menu.Product'),
	
	searchView : 'bar_product_search',
	
	gridView : 'bar_product_list'
	
});
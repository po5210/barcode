Ext.define('Bar.view.product.ProductDetail', {
	
	extend : 'Base.abstract.Popup',
	
 	requires : [ 
		'Bar.view.product.ProductForm'
	],
	
	xtype : 'bar_product_detail',
	
	title : T('menu.Product'),
		
	items : [ {
		xtype : 'bar_product_form'
	} ],
	
	setRecord : function(record) {
		this.record = record;
		this.down('form').loadRecord(this.record);
	},
	
	getRecord : function() {
		return this.record;
	}
});
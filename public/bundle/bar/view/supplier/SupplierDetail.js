Ext.define('Bar.view.supplier.SupplierDetail', {
	
	extend : 'Base.abstract.Popup',
	
 	requires : [ 
		'Bar.view.supplier.SupplierForm'
	],
	
	xtype : 'bar_supplier_detail',
	
	title : T('menu.Supplier'),
		
	items : [ {
		xtype : 'bar_supplier_form'
	} ],
	
	setRecord : function(record) {
		this.record = record;
		this.down('form').loadRecord(this.record);
	},
	
	getRecord : function() {
		return this.record;
	}
});
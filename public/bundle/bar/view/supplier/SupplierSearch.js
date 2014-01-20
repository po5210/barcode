Ext.define('Bar.view.supplier.SupplierSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'bar_supplier_search',
		
	items : [
		{ fieldLabel : T('label.code'), name : 'name-like' },
		{ fieldLabel : T('label.name'), name : 'description-like' },
	]
	
});
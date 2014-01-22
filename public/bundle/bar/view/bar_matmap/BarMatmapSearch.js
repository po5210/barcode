Ext.define('Bar.view.bar_matmap.BarMatmapSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'bar_bar_matmap_search',
		
	items : [
		{ fieldLabel : T('label.name'), name : 'name-like' },
		{ fieldLabel : T('label.description'), name : 'description-like' },
		{ fieldLabel : T('title.supplier'), name : 'supplier.name-eq', xtype : 'entitysearchcombo', storeClass : 'Bar.store.Supplier', valueField : 'name' },
	]
	
});
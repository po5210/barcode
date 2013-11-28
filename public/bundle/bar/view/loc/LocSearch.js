Ext.define('Bar.view.loc.LocSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'bar_loc_search',
		
	items : [
		{ fieldLabel : T('label.code'), name : 'name-like' },
		{ fieldLabel : T('label.name'), name : 'description-like' },
		{ fieldLabel : T('label.baseloc'), name : 'baseloc.name-eq', xtype : 'entitysearchcombo', storeClass : 'Bar.store.Baseloc', valueField : 'name' },
		{ fieldLabel : T('label.prod_line_fg'), name : 'prod_line_fg-eq', xtype : 'codecombo', commonCode : 'PROD_LINE_TYPE', displayField : 'description' },
		{ fieldLabel : T('label.use_yn'), name : 'use_yn-eq', xtype : 'codecombo', commonCode : 'USE_YN', displayField : 'description' }
	]
	
});
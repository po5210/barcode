Ext.define('Bar.view.bar_locmap.BarLocmapSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'bar_bar_locmap_search',
		
	items : [
		{ fieldLabel : T('label.code'), name : 'name-like' },
		{ fieldLabel : T('label.name'), name : 'description-like' },
		{ fieldLabel : T('label.prod_line_fg'), name : 'prod_line_fg-eq', xtype : 'codecombo', commonCode : 'LOC_TYPE', displayField : 'description' },
		{ fieldLabel : T('label.use_yn'), name : 'use_yn-eq', xtype : 'codecombo', commonCode : 'USE_YN', displayField : 'description' },
	]
	
});
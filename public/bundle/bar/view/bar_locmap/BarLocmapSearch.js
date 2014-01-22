Ext.define('Bar.view.bar_locmap.BarLocmapSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'bar_bar_locmap_search',
		
	items : [
		{ fieldLabel : T('title.bar_locgrp'), name : 'bar_locgrp.name-eq', xtype : 'entitysearchcombo', storeClass : 'Bar.store.BarLocgrp', valueField : 'name' },
		{ fieldLabel : T('label.code'), name : 'name-like' },
		{ fieldLabel : T('label.name'), name : 'description-like' },
		{ fieldLabel : T('label.use_yn'), name : 'use_yn-eq', xtype : 'codecombo', commonCode : 'USE_YN', displayField : 'description' },
		{ fieldLabel : T('label.prod_line_fg'), name : 'prod_line_fg-eq', xtype : 'codecombo', commonCode : 'LOC_TYPE', displayField : 'description' },
	]
	
});
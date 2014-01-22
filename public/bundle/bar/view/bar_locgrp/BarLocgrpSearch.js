Ext.define('Bar.view.bar_locgrp.BarLocgrpSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'bar_bar_locgrp_search',
		
	items : [
		{ fieldLabel : T('label.code'), name : 'name-like' },
		{ fieldLabel : T('label.name'), name : 'description-like' },
		{ fieldLabel : T('label.use_yn'), name : 'use_yn-eq', xtype : 'codecombo', commonCode : 'USE_YN', displayField : 'description' },
	]
	
});
Ext.define('Bar.view.baseloc.BaselocSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'bar_baseloc_search',
		
	items : [
		{ fieldLabel : T('label.code'), name : 'name-like' },
		{ fieldLabel : T('label.name'), name : 'description-like' },
		{ fieldLabel : T('label.baseloc_fg'), name : 'baseloc_fg-eq', xtype : 'codecombo', commonCode : 'WH_TYPE' },
		{ fieldLabel : T('label.div_cd'), name : 'div_cd-like' },
		{ fieldLabel : T('label.inloc_cd'), name : 'inloc_cd-like' },
		{ fieldLabel : T('label.outloc_cd'), name : 'outloc_cd-like' },
		{ fieldLabel : T('label.baseloc_nmk'), name : 'baseloc_nmk-like' },
		{ fieldLabel : T('label.use_yn'), name : 'use_yn-eq', xtype : 'codecombo', commonCode : 'USE_YN', displayField : 'description' },
	]
	
});
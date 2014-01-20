Ext.define('Bar.view.baseloc.BaselocSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'bar_baseloc_search',
		
	items : [
		{ fieldLabel : T('label.code'), name : 'baseloc_cd' },
		{ fieldLabel : T('label.name'), name : 'baseloc_nm' },
		{ fieldLabel : T('label.baseloc_fg'), name : 'baseloc_fg', xtype : 'codecombo', commonCode : 'WH_TYPE' },
		{ fieldLabel : T('label.div_cd'), name : 'div_cd' },
		{ fieldLabel : T('label.inloc_cd'), name : 'inloc_cd' },
		{ fieldLabel : T('label.outloc_cd'), name : 'outloc_cd' },
		{ fieldLabel : T('label.baseloc_nmk'), name : 'baseloc_nmk' },
		{ fieldLabel : T('label.use_yn'), name : 'use_yn', xtype : 'codecombo', commonCode : 'YES_NO', displayField : 'description' }
	]
	
});
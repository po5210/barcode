Ext.define('Bar.view.loc.LocSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'bar_loc_search',
		
	items : [
		{ fieldLabel : T('label.baseloc_cd'), name : 'baseloc_cd-like' },
		{ fieldLabel : T('label.loc_cd'), name : 'loc_cd-like' },
		{ fieldLabel : T('label.prod_line_fg'), name : 'prod_line_fg' , xtype : 'codecombo', commonCode : 'LOC_TYPE', displayField : 'description' },
		{ fieldLabel : T('label.use_yn'), name : 'use_yn', xtype : 'codecombo', commonCode : 'YES_NO', displayField : 'description' },
	]
	
});
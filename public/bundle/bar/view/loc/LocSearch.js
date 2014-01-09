Ext.define('Bar.view.loc.LocSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'bar_loc_search',
		
	items : [
		{ fieldLabel : T('label.code'), name : 'loc_cd' },
		{ fieldLabel : T('label.name'), name : 'loc_nm' },
		{ fieldLabel : T('label.baseloc'), name : 'baseloc_nm', xtype : 'entitysearchcombo', storeClass : 'Bar.store.Baseloc', valueField : 'name' },
		{ fieldLabel : T('label.prod_line_fg'), name : 'prod_line_fg', xtype : 'codecombo', commonCode : 'PROD_LINE_TYPE', displayField : 'description' },
		{ fieldLabel : T('label.use_yn'), name : 'use_yn', xtype : 'codecombo', commonCode : 'YES_NO', displayField : 'description' }
	]
	
});
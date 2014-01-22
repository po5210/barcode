Ext.define('Bar.view.report.GiBySer', {
	
	extend: 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'Bar.view.report.GiBySerSearch',
		'Bar.view.report.GiBySerList'
	],
	
	xtype : 'bar_gi_by_ser',
	
	title : T('menu.GiBySer'),
	
	searchView : 'bar_gi_by_ser_search',
	
	gridView : 'bar_gi_by_ser_list'

});
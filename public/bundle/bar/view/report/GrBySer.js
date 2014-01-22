Ext.define('Bar.view.report.GrBySer', {
	
	extend: 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'Bar.view.report.GrBySerSearch',
		'Bar.view.report.GrBySerList'
	],
	
	xtype : 'bar_gr_by_ser',
	
	title : T('menu.GrBySer'),
	
	searchView : 'bar_gr_by_ser_search',
	
	gridView : 'bar_gr_by_ser_list'

});
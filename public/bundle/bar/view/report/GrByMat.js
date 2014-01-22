Ext.define('Bar.view.report.GrByMat', {
	
	extend: 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'Bar.view.report.GrByMatSearch',
		'Bar.view.report.GrByMatList'
	],
	
	xtype : 'bar_gr_by_mat',
	
	title : T('menu.GrByMat'),
	
	searchView : 'bar_gr_by_mat_search',
	
	gridView : 'bar_gr_by_mat_list'

});
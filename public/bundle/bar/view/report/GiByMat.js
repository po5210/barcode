Ext.define('Bar.view.report.GiByMat', {
	
	extend: 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'Bar.view.report.GiByMatSearch',
		'Bar.view.report.GiByMatList'
	],
	
	xtype : 'bar_gi_by_mat',
	
	title : T('menu.GiByMat'),
	
	searchView : 'bar_gi_by_mat_search',
	
	gridView : 'bar_gi_by_mat_list'

});
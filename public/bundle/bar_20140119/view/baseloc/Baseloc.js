Ext.define('Bar.view.baseloc.Baseloc', {
	
	extend: 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'Bar.view.baseloc.BaselocSearch',
		'Bar.view.baseloc.BaselocList'
	],
	
	xtype : 'bar_baseloc',
	
	title : T('menu.Baseloc'),
	
	searchView : 'bar_baseloc_search',
	
	gridView : 'bar_baseloc_list'
	
});
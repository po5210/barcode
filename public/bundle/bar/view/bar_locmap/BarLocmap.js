Ext.define('Bar.view.bar_locmap.BarLocmap', {
	
	extend: 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'Bar.view.bar_locmap.BarLocmapSearch',
		'Bar.view.bar_locmap.BarLocmapList'
	],
	
	xtype : 'bar_bar_locmap',
	
	title : T('menu.BarLocmap'),
	
	searchView : 'bar_bar_locmap_search',
	
	gridView : 'bar_bar_locmap_list'
	
});
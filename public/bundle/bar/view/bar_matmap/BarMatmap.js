Ext.define('Bar.view.bar_matmap.BarMatmap', {
	
	extend: 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'Bar.view.bar_matmap.BarMatmapSearch',
		'Bar.view.bar_matmap.BarMatmapList'
	],
	
	xtype : 'bar_bar_matmap',
	
	title : T('menu.BarMatmap'),
	
	searchView : 'bar_bar_matmap_search',
	
	gridView : 'bar_bar_matmap_list'
	
});
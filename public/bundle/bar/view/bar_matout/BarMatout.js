Ext.define('Bar.view.bar_matout.BarMatout', {
	
	extend: 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'Bar.view.bar_matout.BarMatoutSearch',
		'Bar.view.bar_matout.BarMatoutList'
	],
	
	xtype : 'bar_bar_matout',
	
	title : T('menu.BarMatout'),
	
	searchView : 'bar_bar_matout_search',
	
	gridView : 'bar_bar_matout_list'
	
});
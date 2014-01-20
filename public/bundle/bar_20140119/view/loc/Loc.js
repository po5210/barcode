Ext.define('Bar.view.loc.Loc', {
	
	extend: 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'Bar.view.loc.LocSearch',
		'Bar.view.loc.LocList'
	],
	
	xtype : 'bar_loc',
	
	title : T('menu.Loc'),
	
	searchView : 'bar_loc_search',
	
	gridView : 'bar_loc_list'
	
});
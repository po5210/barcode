Ext.define('Bar.view.part_group.PartGroup', {
	
	extend: 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'Bar.view.part_group.PartGroupSearch',
		'Bar.view.part_group.PartGroupList'
	],
	
	xtype : 'bar_part_group',
	
	title : T('menu.PartGroup'),
	
	searchView : 'bar_part_group_search',
	
	gridView : 'bar_part_group_list'
	
});
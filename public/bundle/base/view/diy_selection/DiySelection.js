Ext.define('Base.view.diy_selection.DiySelection', {
	
	extend: 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'Base.view.diy_selection.DiySelectionSearch',
		'Base.view.diy_selection.DiySelectionList'
	],
	
	xtype : 'base_diy_selection',
	
	title : T('title.diy_selection'),
	
	searchView : 'base_diy_selection_search',
	
	gridView : 'base_diy_selection_list'
	
});
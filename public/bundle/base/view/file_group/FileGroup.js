Ext.define('Base.view.file_group.FileGroup', {
	
	extend : 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'Base.view.file_group.FileGroupSearch',
		'Base.view.file_group.FileGroupList'
	],
	
	xtype : 'base_file_group',
		
	title : T('title.file_group'),
	
	searchView : 'base_file_group_search',
	
	gridView : 'base_file_group_list'
	
});
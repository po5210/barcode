Ext.define('Base.view.file_group.FileGroupSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'base_file_group_search',
		
	items : [ 
		{ fieldLabel : T('label.name'), name : 'name-like' },
		{ fieldLabel : T('label.description'), name : 'description-like' }
	]
	
});
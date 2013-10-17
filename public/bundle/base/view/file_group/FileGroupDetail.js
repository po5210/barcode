Ext.define('Base.view.file_group.FileGroupDetail', {
	
	extend : 'Base.abstract.Popup',
	
	xtype : 'base_file_group_detail',
	
	title : T('title.entity_details', {entity : T('title.file_group')}),
	
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	
	items : [ {
		xtype : 'attachment_grid',
		flex : 1
	} ],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'close']
	} ]
});
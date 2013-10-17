Ext.define('Base.view.file_group.FileGroupList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'base_file_group_list',
	
	useDetailBtn : false,
	
	selectionMode : 'SINGLE',
	
	store : 'Base.store.FileGroup',
	
	columns : [
		{ xtype: 'actioncolumn', icon: ASSET_PATH + 'std/iconSlideshow.png', itemId : 'slideshow', width : 50, align : 'center' },
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ dataIndex : 'domain_id', hidden : true },
		{ header : T('label.name'), width : 200, dataIndex : 'name', editor : {xtype : 'textfield'} },
		{ header : T('label.description'), width : 250, dataIndex : 'description', editor : {xtype : 'textfield'} },
		{ header : T('label.creator'), dataIndex : 'creator', xtype : 'entitycolumn' },
		{ header : T('label.created_at'), width : 120, dataIndex : 'created_at', xtype : 'datecolumn', readOnly : true, format : T('format.datetime') },
		{ header : T('label.updater'), dataIndex : 'updater', xtype : 'entitycolumn' },
		{ header : T('label.updated_at'), width : 120, dataIndex : 'updated_at', xtype : 'datecolumn', readOnly : true, format : T('format.datetime') }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'add', 'update', 'save', 'delete']
	} ]

});
Ext.define('Base.view.diy_selection.DiySelectionList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'base_diy_selection_list',
		
	store : 'Base.store.DiySelection',
	
	columns : [
		{ dataIndex : '_cud_flag_', hidden : true,  value : '' },
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ dataIndex : 'domain_id',  hidden : true },
		{ header : T('label.name'), dataIndex : 'name', flex: 1, allowBlank : false, editor : { xtype : 'textfield' }, sortOption : { sortSeq: 10, sortDirection: 'asc'} },
		{ header : T('label.description'), dataIndex : 'description', flex : 2, editor : { xtype : 'textfield' } },
		{ header : T('label.script_type'), dataIndex : 'script_type', allowBlank : false, editor : { xtype : 'codecombo', commonCode : 'SCRIPT_TYPE' } },
		{ header : T('label.view_type'), dataIndex : 'view_type', editor : { xtype : 'codecombo', commonCode : 'VIEW_TYPE' } },
		{ header : T('label.updater'), dataIndex : 'updater', xtype : 'entitycolumn' },
		{ header : T('label.updated_at'), width : 120, dataIndex : 'updated_at', xtype : 'datecolumn', format : T('format.datetime') }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'add', 'save', 'delete']
	} ]
});
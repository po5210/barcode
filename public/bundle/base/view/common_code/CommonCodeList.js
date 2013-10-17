Ext.define('Base.view.common_code.CommonCodeList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'base_common_code_list',
		
	store : 'Base.store.CommonCode',
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'add', 'save', 'delete']
	} ],
	
	columns : [
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ header : T('label.domain_id'), dataIndex : 'domain_id',  hidden : true },
		{ header : T('label.name'), dataIndex : 'name', flex : 1, editor : { xtype : 'textfield' } },
		{ header : T('label.description'), flex : 2, dataIndex : 'description' , editor : { xtype : 'textfield' } },
		{ header : T('label.creator'), dataIndex : 'creator', xtype : 'entitycolumn' },
		{ header : T('label.created_at'), width : 120, dataIndex : 'created_at', xtype : 'datecolumn', readOnly : true, format : T('format.datetime') },
		{ header : T('label.updater'), dataIndex : 'updater', xtype : 'entitycolumn' },
		{ header : T('label.updated_at'), width : 120, dataIndex : 'updated_at', xtype : 'datecolumn', readOnly : true, format : T('format.datetime') },
		{ dataIndex : '_cud_flag_', hidden : true,  value : '' }
	]
});
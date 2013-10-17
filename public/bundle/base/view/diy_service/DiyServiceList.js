Ext.define('Base.view.diy_service.DiyServiceList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'base_diy_service_list',
		
	store : 'Base.store.DiyService',
	
	columns : [
		{ dataIndex : '_cud_flag_', hidden : true,  value : '' },
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ dataIndex : 'domain_id',  hidden : true },
		{ header : T('label.name'), dataIndex : 'name', flex : 1.2, editor : { xtype : 'textfield', allowBlank : false }, sortOption : { sortSeq: 10, sortDirection: 'asc'} },
		{ header : T('label.description'), dataIndex : 'description', flex : 2, editor : { xtype : 'textfield', allowBlank : true } },
		{ header : T('label.script_type'), dataIndex : 'script_type', editor : { xtype : 'codecombo', commonCode : 'SCRIPT_TYPE' } },
		{ header : T('label.active_flag'), dataIndex : 'active_flag', flex : 0.5, xtype : 'checkcolumn' },
		{ header : T('label.atomic_flag'), dataIndex : 'atomic_flag', flex : 0.5, xtype : 'checkcolumn' },
		{ header : T('label.updater'), dataIndex : 'updater', xtype : 'entitycolumn', flex : 0.5 },
		{ header : T('label.updated_at'), flex : 1, dataIndex : 'updated_at', xtype : 'datecolumn', format : T('format.datetime') }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'add', 'save', 'delete']
	} ]
});
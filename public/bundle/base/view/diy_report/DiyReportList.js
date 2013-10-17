Ext.define('Base.view.diy_report.DiyReportList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'base_diy_report_list',
		
	store : 'Base.store.DiyReport',
	
	columns : [
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ header : T('label.domain_id'), dataIndex : 'domain_id', sortable : false,  hidden : true },
		{ header : T('label.name'), dataIndex : 'name', width : 200, editor : { xtype : 'textfield' }, sortOption : { sortSeq : 10, sortDirection : 'asc'} },
		{ header : T('label.description'), dataIndex : 'description', width : 200, editor : { xtype : 'textfield' } },
		{ header : T('title.diy_selection'), dataIndex : 'diy_selection', width : 200, xtype : 'entitycolumn', editor : { xtype: 'entitycolumneditor', storeClass: 'Base.store.DiySelection' } },
		{ header : T('label.creator'), dataIndex : 'creator', xtype : 'entitycolumn' },
		{ header : T('label.created_at'), width : 120, dataIndex : 'created_at', xtype : 'datecolumn', readOnly : true, format : T('format.datetime') },
		{ header : T('label.updater'), dataIndex : 'updater', xtype : 'entitycolumn' },
		{ header : T('label.updated_at'), width : 120, dataIndex : 'updated_at', xtype : 'datecolumn', readOnly : true, format : T('format.datetime') },
		{ header : 'cud flag', dataIndex : '_cud_flag_', hidden : true, sortable : false, width : 0, value : '' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'add', 'save', 'delete']
	} ]
});
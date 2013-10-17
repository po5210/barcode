Ext.define('Base.view.attachment.AttachmentList', {
	
	extend : 'Base.abstract.entity.ListGrid2View',
	
	xtype : 'base_attachment_list',
		
	store : 'Base.store.Attachment',
	
	columns : [
		{ dataIndex : '_cud_flag_', hidden : true,  value : '' },
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ dataIndex : 'domain_id',  hidden : true },
		{ header : T('label.name'), dataIndex : 'name', width: 200, allowBlank : false, editor : { xtype : 'textfield' } },
		{ header : T('label.description'), dataIndex : 'description', flex: 1, allowBlank : false, editor : { xtype : 'textfield' } },
		{ header : T('label.creator'), dataIndex : 'creator', xtype : 'entitycolumn' },
		{ header : T('label.created_at'), width : 120, dataIndex : 'created_at', xtype : 'datecolumn', format : T('format.datetime') },
		{ header : T('label.updater'), dataIndex : 'updater', xtype : 'entitycolumn' },
		{ header : T('label.updated_at'), width : 120, dataIndex : 'updated_at', xtype : 'datecolumn', format : T('format.datetime') }
	]

});
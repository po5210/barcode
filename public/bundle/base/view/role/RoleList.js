Ext.define('Base.view.role.RoleList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'base_role_list',
		
	store : 'Base.store.Role',
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'add', 'save', 'delete']
	} ],
	
	columns : [ { 
		header : T('label.id'),
		dataIndex : 'id',
		hidden : true
	}, { 
		dataIndex : '_cud_flag_', 
		hidden : true, 
		value : '' 
	}, { 
		dataIndex : 'domain_id', 
		hidden : true 
	}, { 
		dataIndex : 'name', 
		header : T('label.name'),
		editor : {
			xtype : 'textfield',
			allowBlank : false
		},
		sortOption : {
			sortSeq : 1,
			sortDirection : 'desc'	
		}
	}, { 
		dataIndex : 'description', 
		header : T('label.description'),
		flex : 1,
		editor : {
			xtype: 'textfield',
			allowBlank: true
		}
	}, { 
		header : T('label.creator'),
		dataIndex : 'creator',
		xtype : 'entitycolumn'
	}, { 
		dataIndex : 'created_at', 
		header : T('label.created_at'), 
		xtype : 'datecolumn', 
		format : T('format.datetime'), 
		width : 120
	}, { 
		header : T('label.updater'),
		dataIndex : 'updater',
		xtype : 'entitycolumn'
	}, { 
		dataIndex : 'updated_at', 
		header : T('label.updated_at'), 
		xtype : 'datecolumn', 
		format : T('format.datetime'), 
		width : 120
	} ]	
});
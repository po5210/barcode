Ext.define('Base.view.user.UserList', {
	
	extend : 'Base.abstract.entity.ListGrid2View',
	
	requires : ['Ext.ux.CheckColumn'],
	
	xtype : 'base_user_list',
		
	store : 'Base.store.User',
	
	verticalScroller : { variableRowHeight: true },
	
	selModel : Ext.create('Ext.selection.CheckboxModel', { pruneRemoved : false }),
	
	columns : [ {
		xtype : 'actioncolumn', 
		width : 30, 
		align : 'center', 
		itemId : 'go_detail',
		items : [ { icon : 'theme/image/iconDetail.png', tooltip : T('title.details') } ]
	}, { 
		dataIndex : 'id',
		text : T('label.id'),
		hidden : true,
		sortOption: {
			sortSeq: 10,
			sortDirection: 'asc'
		}
	}, {
		dataIndex : 'login',
		text : T('label.login'),
		flex : 1
	}, {
		dataIndex : 'name',
		text : T('label.name'),
		flex : 1
	}, {
		dataIndex : 'email',
		text : T('label.email'),
		flex : 1.5
	}, {
		dataIndex : 'dept',
		text : T('label.dept'),
		xtype : 'codecolumn',
		tpl : '{description}', 
		commonCode : 'PROD_DEPT', 
		flex : 1
	}, {
		xtype : 'checkcolumn',
		dataIndex : 'admin_flag',
		text : T('label.admin'),
		width : 60
	}, {
		xtype : 'checkcolumn',
		dataIndex : 'operator_flag',
		text : T('label.operator_flag'),
		width : 70
	}, {
		header : T('label.updated_at'),
		dataIndex : 'updated_at',
		xtype : 'datecolumn',
		readOnly : true,
		format : T('format.datetime'),
		width : 130 
	} ],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'import', 'new', 'delete']
	} ]
});
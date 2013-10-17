Ext.define('Base.view.menu.MenuList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'base_menu_list',
		
	store : 'Base.store.Menu',
	
	columns : [
		{ dataIndex : '_cud_flag_', hidden : true,  value : '' },
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ header : T('label.name'), dataIndex : 'name', width : 100, editor : { xtype : 'textfield', allowBlank : false } },
		{ 
			header : T('label.display'), 
			dataIndex : 'name', 
			width : 100, 
			renderer : function(val) {
				return T('menu.' + val);
			}
		},
		{ header : T('label.description'), width : 150, dataIndex : 'description', editor : { xtype : 'textfield', allowBlank : true } },
		{ dataIndex : 'domain_id',  hidden : true },
		{ header : T('label.category'), dataIndex : 'category', editor : { xtype : 'codecombo', commonCode : 'MENU_CATEGORY' } },
		{ header : T('label.menu_type'), dataIndex : 'menu_type', editor : { xtype : 'codecombo', commonCode : 'MENU_TYPE' } },
		{ header : T('label.rank'), dataIndex : 'rank', editor : { xtype : 'numberfield' }, width : 55, align : 'right' },
		{ header : T('label.hidden_flag'), dataIndex : 'hidden_flag', xtype : 'checkcolumn', width : 60 },
		// { header : T('label.icon_path'), dataIndex : 'icon_path', width : 100, editor : { xtype : 'textfield' } },
		{ header : T('label.creator'), dataIndex : 'updater', xtype : 'entitycolumn' },
		{ header : T('label.created_at'), width : 130, dataIndex : 'created_at', xtype : 'datecolumn', format : T('format.datetime') },
		{ header : T('label.updater'), dataIndex : 'updater', xtype : 'entitycolumn' },
		{ header : T('label.updated_at'), width : 130, dataIndex : 'updated_at', xtype : 'datecolumn', format : T('format.datetime') }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'add', 'save', 'delete']
	} ]

});
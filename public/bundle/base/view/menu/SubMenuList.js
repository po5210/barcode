Ext.define('Base.view.menu.SubMenuList', {
	
	extend : 'Ext.grid.Panel',
	
	xtype : 'base_submenu_list',
		
	store : Ext.create('Ext.data.Store', {
		fields : [ 
			{ name : 'id', type : 'string' }, 
			{ name : 'domain_id', type : 'string'}, 
			{ name : 'name', type : 'string' }, 
			{ name : '_cud_flag_', type : 'string' }, 
			{ name : 'description', type : 'string' }, 
			{ name : 'parent_id', type : 'string' }, 
			{ name : 'entity_id', type : 'string' }, 
			{ name : 'entity', type : 'auto' }, 
			{ name : 'template', type : 'string' }, 
			{ name : 'menu_type', type : 'string' }, 
			{ name : 'category', type : 'string' }, 
			{ name : 'rank', type : 'integer' }, 
			{ name : 'icon_path', type : 'string' },
			{ name : 'hidden_flag', type : 'boolean' },
			{ name : 'creator_id', type : 'string' }, 
			{ name : 'updater_id', type : 'string' }, 
			{ name : 'created_at', type : 'date' }, 
			{ name : 'updated_at', type : 'date' } 
		],
		data : [],
	  	proxy: {
			type: 'ajax',
			url : '/domains/' + login.current_domain_id + '/menus.json',
			format : 'json',
		    reader: {
				type: 'json',
				root: 'items',
				successProperty : 'success',
				totalProperty : 'total'
	        },
	        writer: {
				type: 'json'
	        }
		}
	}),
	
    plugins : [ Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit : 1,
        autoCancel : true
    }) ],
	
	columns : [ 
		{ dataIndex : '_cud_flag_', hidden : true,  value : '' },
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ header : T('label.name'), dataIndex : 'name', width : 150, editor : { xtype : 'textfield', allowBlank : false } },
		{ 
			header : T('label.display'), 
			dataIndex : 'name', 
			width : 150, 
			renderer : function(val) {
				return T('menu.' + val);
			}
		},
		{ header : T('label.description'), dataIndex : 'description', width : 150, editor : { xtype : 'textfield', allowBlank : true } },
		{ header : T('label.category'), dataIndex : 'category', editor : { xtype : 'codecombo', commonCode : 'MENU_CATEGORY' } },
		{ header : T('label.menu_type'), dataIndex : 'menu_type', editor : { xtype : 'codecombo', commonCode : 'MENU_TYPE' } },
		{ dataIndex : 'domain_id',  hidden : true },
		{ xtype : 'entitycolumn', header : T('title.entity'), dataIndex : 'entity', editor : { xtype : 'entitycolumneditor', storeClass : 'Base.store.Entity' } },
		{ header : T('label.screen_id'), dataIndex : 'template', width : 300, editor : { xtype : 'textfield' } },
		{ header : T('label.rank'), dataIndex : 'rank', editor : { xtype : 'numberfield' }, width : 55, align : 'right' },
		// { header : T('label.icon_path'), dataIndex : 'icon_path', width : 100, editor : { xtype : 'textfield' } },
		{ header : T('label.hidden_flag'), dataIndex : 'hidden_flag', xtype : 'checkcolumn', width : 60 }
	 ],
	
	selModel : Ext.create('Ext.selection.CheckboxModel'),
	
	tools : [ { itemId : 'tool', type : 'maximize' } ],
	
	tbar : { xtype : 'textfield', readOnly : true },
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'add', 'save', 'delete']
	} ]

});
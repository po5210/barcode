Ext.define('Base.view.role.RolePermissions', {
	
	extend : 'Ext.tree.Panel',
	
	requires : ['Ext.ux.CheckColumn'],
	
	xtype : 'base_role_permissions',
	
	title : T('title.menu_auth'),
	
	rootVisible : false,
	
	store : Ext.create('Ext.data.TreeStore', {
		fields : [
			{name: 'id', type: 'string'},
			{name: 'text', type: 'string'},
			{name: 'leaf', type: 'boolean'},
			{name: 'expanded', type: 'boolean'},
			{name: 'check_all', type: 'boolean'},
			{name: 'show', type: 'boolean'},
			{name: 'create', type: 'boolean'},
			{name: 'update', type: 'boolean'},
			{name: 'delete', type: 'boolean'}
		],
		root : {
			expanded : true,
			children : []
		}
	}),
	
	columns : [ {
		dataIndex : 'id', 
		itemId : 'menu_id',
		hidden : true
	}, { 
		xtype: 'treecolumn',
		text: T('menu.Menu'),
		sortable: true,
		dataIndex: 'text',
		width : 200
	}, { 
		xtype : 'checkcolumn', 
		header : T('button.check_all'),
		dataIndex : 'check_all',
		sortable: false,
		listeners : {
			checkchange : function(checkcolumn, rowIndex, checked, eOpts) {
				var ownerCt = checkcolumn.ownerCt;
				var view = ownerCt.view;
				var record = view.store.data.items[rowIndex];
				record.set('show', checked);
				record.set('create', checked);
				record.set('update', checked);
				record.set('delete', checked);
				
				// leaf 노드가 아니라면 자식 노드들을 모두 똑같이 체크 
				/*if(!record.get('leaf')) {
					var treestore = this.up(' base_role_permissions').store;
					var rootNode = treestore.getRootNode();
					var node = rootNode.findChildBy(function(node) {
						if(node.data.id == record.get('id')) {
							return true;
						}
					});
					node.eachChild(function(child) {
						child.set('check_all', checked);
						child.set('show', checked);
						child.set('create', checked);
						child.set('update', checked);
						child.set('delete', checked);
					});
				}*/
			}
		}
	}, { 
		xtype : 'checkcolumn', 
		header : T('button.show'),
		dataIndex : 'show',
		itemId : 'show_action',
		sortable: false
	}, { 
		xtype : 'checkcolumn', 
		header : T('button.create'),
		dataIndex : 'create',
		itemId : 'create_action',
		sortable: false
	}, { 
		xtype : 'checkcolumn', 
		header : T('button.update'),
		dataIndex : 'update',
		itemId : 'update_action',
		sortable: false
	}, { 
		xtype : 'checkcolumn', 
		header : T('button.delete'),
		dataIndex : 'delete',
		itemId : 'delete_action',
		sortable: false
	} ],
	
	afterRender: function() {
		this.callParent();
		this.fireEvent('after_role_permission_render', this);
	},
	
	renderPermissions : function(roleId, permissions) {
		var self = this;
		var mainMenuList = this.getMainMenuList(permissions);
		Ext.Array.each(mainMenuList, function(mainMenu) {
			mainMenu.children = self.getTreeChildren(mainMenu, permissions);
		});
		this.store.setRootNode({ expanded: true, children: mainMenuList });
	},
	
	getMainMenuList : function(records) {
		var list = [];
		Ext.each(records, function(record) {
			if(!record.parent_id) {
				list.push({
					'id' : record.id, 
					'text' : T('menu.' + record.name), 
					'expanded' : true, 
					'show' : record.show,
					'create' : false, 
					'update' : false, 
					'delete' : false 
				});
			}
		});
		return list;
	},
	
	getTreeChildren : function(mainMenu, records) {
		var children = [];
		Ext.each(records, function(record) {
			if(record.parent_id && mainMenu.id == record.parent_id) {
				children.push({ 
					id : record.id, 
					text : T('menu.' + record.name), 
					leaf : true, 
					expanded : true, 
					show : record.show,
					create : record.create,
					update : record.update,
					delete : record.delete,
					children : []
				});
			}
		});
		return children;
	},
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'back', 'save']
	} ]
});
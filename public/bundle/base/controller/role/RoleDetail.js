/**
 * RoleDetail controller
 */
Ext.define('Base.controller.role.RoleDetail', {
	
	extend: 'Base.abstract.entity.DetailMainController',
	
	requires : [ 
		'Base.model.Role', 
		'Base.store.Role', 
		'Base.store.User',
		'Base.view.role.RoleDetail'
	],
	
	models : ['Base.model.Role'],
	
	stores: ['Base.store.Role'],
	
	views : ['Base.view.role.RoleDetail'],
	
	refs: [ 
		{ ref : 'RoleDetail', selector : 'base_role_detail' },
		{ ref : 'RoleForm', selector : 'base_role_form' },
		{ ref : 'RoleUser', selector : 'base_role_user' },
		{ ref : 'RolePermission', selector : 'base_role_permissions' } 
	],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'base_role_detail' : {
				paramschange : this.onParamsChange,
				after_detail_loaded : this.afterDetailLoaded
			},
			' base_role_form' : {
				click_back : this.onBackClick,
				click_new :  this.onFormNew,
				click_save :  this.onFormSave,
				click_delete : this.onFormDelete,
				after_form_saved : this.afterFormSaved
			},
			' base_role_user' : {
				click_back : this.onBackClick,
				click_add : this.showUsersPopup,
				click_delete : this.deleteRoleUsers,
				after_role_user_render : this.loadRoleUsers,
				add_role_users : this.addRoleUsers
			},
			' base_role_permissions' : {
				click_back : this.onBackClick,
				click_save : this.onRolePmssSave,
				after_role_permission_render : this.loadRolePermissions
			}
		});
	},
	
	/****************************************************************
	 ** 					여기는 customizing area 					**
	 ****************************************************************/
	/**
	 * after role permission render
	 */
	loadRolePermissions : function(view) {
		var self = this;
		Ext.Ajax.request({
			url: '/domains/' + login.current_domain_id + '/roles/' + this.selectedRecord.data.id + '/permitted_resources.json?resource_type=Menu',
			method : 'GET',
			success : function(response) {
				var res = Ext.JSON.decode(response.responseText);
				var permissions = [];
				Ext.Array.each(res.items, function(item) {
					var pmss = self.findPermission(permissions, item);
					if(!pmss) {
						pmss = item;
						permissions.push(pmss);
					}
					if(item.action_name && item.action_name != '') {
						pmss[item.action_name] = true;
					}
				});
				view.renderPermissions(this.selectedRecord.data.id, permissions);
			},
			scope : this
		});
	},
	
	/**
	 * permission 찾기
	 */
	findPermission : function(permissions, pmss) {
		var foundPmss = null;
		Ext.Array.each(permissions, function(permission) {
			if(permission.id == pmss.id) {
				foundPmss = permission;
				return true;
			}
		});
		return foundPmss;
	},
	
	/**
	 * role permission save
	 */
	onRolePmssSave : function(view) {
		// master menu
		var treestore = view.store;
		var rootNode = treestore.getRootNode();
		var masterNodes = rootNode.childNodes;
		
		var jsonData = {'permissions' : {'Menu' : {}}};
		Ext.Array.each(masterNodes, function(masterNode) {
			jsonData['permissions']['Menu'][masterNode.data.id] = { 'show' : masterNode.data.show };
		});
		
		// child menu
		var store = view.store;
		var models = store.getModifiedRecords();
		Ext.Array.each(models, function(model) {
			if(model.data.show || model.data.create || model.data.update || model.data.delete) {
				jsonData['permissions']['Menu'][model.data.id] = { 'show' : model.data.show, 'create' : model.data.create, 'update' : model.data.update, 'delete' : model.data.delete };
			}
		});

	    Ext.Ajax.request({
		    url: 'domains/' + login.current_domain_id + '/roles/' + this.selectedRecord.data.id + '/update_permissions.json',
		    method : 'POST',
		    params : { 'role' : Ext.JSON.encode(jsonData) },
		    success : function(response) {
				this.loadRolePermissions(view);
				HF.success(T('text.Success to Save'));
			},
			scope : this
		});
	},
	
	/**
	 * role - user : add user click
	 */
	showUsersPopup : function(view) {
		HF.popup('Base.view.user.UserListPopup', {by:view}, {});
	},
	
	/**
	 * role - user : add user click
	 */
	addRoleUsers : function(view, selections) {
		var records = [];
		Ext.Array.each(selections, function(selection) {
			selection.set('_cud_flag_', 'c');
			records.push(selection.data);
		});
		
		this.updateRoleUsers(view, records);
	},

	/**
	 * role - user : delete user click
	 */
	deleteRoleUsers : function(view) {
		HF.msg.confirm({
			title : T('title.confirm'), 
			msg : T('text.Sure to Delete'), 
			fn : function(confirmBtn) {
				if(confirmBtn = 'yes') {
					var selections = view.getSelectionModel().getSelection();
					var records = [];
					Ext.Array.each(selections, function(selection) {
						selection.set('_cud_flag_', 'd');
						records.push(selection.data);
					});

					this.updateRoleUsers(view, records);
				}
			}, 
			scope : this});
	},
	
	/**
	 * Update Role Users
	 */
	updateRoleUsers : function(view, records) {
		Ext.Ajax.request({
			url : 'domains/' + login.current_domain_id + '/roles/' + this.selectedRecord.data.id + '/update_users.json',
			method : 'POST',
			params : { 'role' : Ext.JSON.encode(records) },
			success : function(response) {
				this.loadRoleUsers(view);
			},
			scope : this
		});
	},
	
	/**
	 * role - user : render role user
	 */
	loadRoleUsers : function(view) {
		Ext.Ajax.request({
			url: 'domains/' + login.current_domain_id + '/roles/' + this.selectedRecord.data.id + '/role_users.json',
			method : 'GET',
			success : function(response) {
				var res = Ext.JSON.decode(response.responseText);
				view.store.loadRawData(res);
			}
		});
	},
	
	/****************************************************************
	 ** 					Override 구현 						   **
	 ****************************************************************/
	/**
	 * override
	 */
	afterDetailLoaded : function(record, operation) {
		this.callParent(arguments);
		this.selectedRecord = record;
		HF.setTitle(T('title.role') + ' ' + record.get('name'));
		this.loadRolePermissions(this.getRolePermission());
		this.loadRoleUsers(this.getRoleUser());
	},
	
	/**
	 * override
	 */
	afterFormSaved : function(form, newRecord) {
		this.callParent(arguments);
	},

	/****************************************************************
	 ** 					abstract method, 필수 구현 				   **
	 ****************************************************************/
	/**
	 * main view를 리턴 
	 */
	getMainView : function() {
		return this.getRoleDetail();
	}
});
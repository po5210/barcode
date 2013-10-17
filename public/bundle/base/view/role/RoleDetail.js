Ext.define('Base.view.role.RoleDetail', {
	
	extend : 'Base.abstract.TabPanel',
	
	requires : [ 
		'Base.view.role.RoleForm',
		'Base.view.role.RoleUser',
		'Base.view.role.RolePermissions'
	],
	
	xtype : 'base_role_detail',
	
	title : T('title.details'),
	
	items : [ {
		xtype : 'base_role_form'
	}, {
		xtype : 'base_role_permissions'
	}, {
		xtype : 'base_role_user'
	} ]
});
Ext.define('Base.view.role.Role', {
	
	extend: 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'Base.view.role.RoleSearch',
		'Base.view.role.RoleList'
	],
	
	xtype : 'base_role',
	
	title : T('title.role'),
	
	searchView : 'base_role_search',
	
	gridView : 'base_role_list'

});
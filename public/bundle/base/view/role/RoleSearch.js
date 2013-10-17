Ext.define('Base.view.role.RoleSearch', {

	extend: 'Base.abstract.entity.ListSearchView',
	
	xtype: 'base_role_search',

	items: [{
		name: 'name-like',
		fieldLabel: T('label.name')
	}, {
		name: 'description-like',
		fieldLabel: T('label.description')
	}]

});

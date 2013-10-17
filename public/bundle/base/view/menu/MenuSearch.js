Ext.define('Base.view.menu.MenuSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'base_menu_search',
		
	items : [ 
		{ fieldLabel : T('label.name'), name : 'name-like' },
		{ fieldLabel : T('label.description'), name : 'description-like' },
		{ fieldLabel : T('label.parent_id'), name : 'parent_id-eq' },
		{ fieldLabel : T('label.entity_id'), name : 'entity_id-eq' },
		{ fieldLabel : T('label.template'), name : 'template-like' },
		{ fieldLabel : T('label.menu_type'), name : 'menu_type-eq' },
		{ fieldLabel : T('label.rank'), name : 'rank-eq', xtype : 'numberfield' }
	]
	
});
Ext.define('Base.view.entity.EntitySearch', {

	extend : 'Base.abstract.entity.ListSearchView',

	xtype : 'base_entity_search',

	items : [
		{ fieldLabel : T('label.name'), name : 'name-like' },
		{ fieldLabel : T('label.description'), name : 'description-like' },
		{ fieldLabel : T('label.bundle'), name : 'bundle-like' }
	]

});
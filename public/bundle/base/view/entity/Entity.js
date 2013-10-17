Ext.define('Base.view.entity.Entity', {

	extend: 'Base.abstract.entity.ListMainView',

 	requires : [ 
		'Base.view.entity.EntitySearch',
		'Base.view.entity.EntityList'
	],

	xtype : 'base_entity',

	title : T('title.entity'),

	searchView : 'base_entity_search',

	gridView : 'base_entity_list'

});
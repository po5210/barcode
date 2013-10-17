Ext.define('Base.view.diy_selection.DiySelectionSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'base_diy_selection_search',
		
	items : [ 
		{ fieldLabel : T('label.name'), name : 'name-like' },
		{ fieldLabel : T('label.description'), name : 'description-like' },
		{ fieldLabel : T('label.script_type'), name : 'script_type-eq', xtype : 'codecombo', commonCode : 'SCRIPT_TYPE' },
		{ fieldLabel : T('label.view_type'), name : 'view_type-eq', xtype : 'codecombo', commonCode : 'VIEW_TYPE' }
	]
	
});
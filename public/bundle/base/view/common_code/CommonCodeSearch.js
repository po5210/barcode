Ext.define('Base.view.common_code.CommonCodeSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'base_common_code_search',
		
	items : [
		{ fieldLabel : T('label.name'), name : 'name-like' },
		{ fieldLabel : T('label.description'), name : 'description-like' }
	]
	
});
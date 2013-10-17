Ext.define('Base.view.terminology.TerminologySearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'base_terminology_search',
		
	items : [ 
		{ fieldLabel : T('label.name'), name : 'name-like' },
		{ fieldLabel : T('label.description'), name : 'description-like' },
		{ fieldLabel : T('label.locale'), name : 'locale-eq', xtype : 'codecombo', displayField : 'description', commonCode : 'LANGUAGE' },
		{ fieldLabel : T('label.category'), name : 'category-eq', xtype : 'codecombo', displayField : 'description', commonCode : 'TERMS_CATEGORY' },
		{ fieldLabel : T('label.display'), name : 'display-like' }
	]
	
});
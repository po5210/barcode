Ext.define('Base.view.terminology.Terminology', {
	
	extend : 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'Base.view.terminology.TerminologySearch',
		'Base.view.terminology.TerminologyList'
	],
	
	xtype : 'base_terminology',
		
	title : T('title.terminology'),
	
	searchView : 'base_terminology_search',
	
	gridView : 'base_terminology_list'
	
});
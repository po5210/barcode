Ext.define('Base.view.diy_report.DiyReportSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'base_diy_report_search',
		
	items : [
		{ fieldLabel : T('label.name'), name : 'name-like' },
		{ fieldLabel : T('label.description'), name : 'description-like' },
		{ fieldLabel : T('title.diy_selection'), name : 'diy_selection.name-eq', xtype : 'entitynamefield', storeClass : 'Base.store.DiySelection' }
	]
	
});
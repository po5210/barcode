Ext.define('Base.view.diy_report.DiyReport', {
	
	extend: 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'Base.view.diy_report.DiyReportSearch',
		'Base.view.diy_report.DiyReportList'
	],
	
	xtype : 'base_diy_report',
	
	title : T('title.diy_report'),
	
	searchView : 'base_diy_report_search',
	
	gridView : 'base_diy_report_list'
	
});
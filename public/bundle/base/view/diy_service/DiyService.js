Ext.define('Base.view.diy_service.DiyService', {
	
	extend: 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'Base.view.diy_service.DiyServiceSearch',
		'Base.view.diy_service.DiyServiceList'
	],
	
	xtype : 'base_diy_service',
	
	title : T('title.diy_service'),
		
	searchView : 'base_diy_service_search',
	
	gridView : 'base_diy_service_list'
	
});
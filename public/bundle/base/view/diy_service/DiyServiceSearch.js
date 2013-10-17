Ext.define('Base.view.diy_service.DiyServiceSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'base_diy_service_search',
		
	items : [ 
		{ fieldLabel : T('label.name'), name : 'name-like' },
		{ fieldLabel : T('label.description'), name : 'description-like' },
		{ fieldLabel : T('label.script_type'), name : 'script_type-eq', xtype : 'codefield', commonCode : 'SCRIPT_TYPE' },
		{ fieldLabel : T('label.active_flag'), name : 'active_flag-eq', inputValue : true, xtype : 'checkboxfield' },
		{ fieldLabel : T('label.atomic_flag'), name : 'atomic_flag-eq', inputValue : true, xtype : 'checkboxfield' }
	]
});
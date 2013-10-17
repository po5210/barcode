Ext.define('Base.view.domain.DomainDetail', {
	
	extend : 'Base.abstract.TabPanel',
	
 	requires : [ 
		'Base.view.domain.DomainForm',
		'Base.view.domain.DomainShiftForm'
	],
	
	xtype : 'base_domain_detail',
	
	title : T('title.entity_details', {entity : T('title.domain')}),
	
	items : [ {
		xtype : 'base_domain_form'
	},{
		xtype : 'base_domain_shift_form'
	} ]
});
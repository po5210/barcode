Ext.define('Base.view.diy_report.DiyReportDetail', {
	
	extend : 'Base.abstract.entity.DetailMainView',
	
 	requires : [ 
		'Base.view.diy_report.DiyReportForm',
		'Base.view.diy_report.DiyReportInParams',
		'Base.view.diy_report.DiyReportOutParams',
		'Base.view.diy_report.DiyReportTest'
	],
	
	xtype : 'base_diy_report_detail',
	
	title : T('title.diy_report'),
	
	items : [ {
		xtype : 'base_diy_report_form'
	}, {
		xtype : 'base_diy_report_in_params'
	}, {
		xtype : 'base_diy_report_out_params'
	}, {
		xtype : 'base_diy_report_test'
	} ],
	
	setRecord : function(record) {
		this.record = record;
		this.setTitle(T('title.diy_report') + ' ' + this.record.get('name'));
		this.down('form').loadRecord(this.record);
	},
	
	getRecord : function() {
		return this.record;
	}
});
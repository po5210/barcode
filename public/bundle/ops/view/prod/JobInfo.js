/**
 * Job Info
 */
Ext.define('Ops.view.prod.JobInfo', {
	
	extend : 'Base.abstract.Popup',
	
	xtype : 'ops_prod_job_info',
	
	title : T('title.job_info'),
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'close']
	} ],
	
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	
	height : 350,
	
	items : [ {
		xtype : 'panel', 
		layout : 'column',
		cls : 'infoFields2Column',
		defaultType : 'displayfield',
		items : [ {
			fieldLabel : T('label.date'),
			name : 'date',
			value : HF.setting.get('option-work_date_disp')
		}, {
			fieldLabel : T('label.shift'),
			name : 'shift',
			value : HF.setting.get('option-shift_name')
		}, {
			fieldLabel : T('label.operation'),
			name : 'operation',
			itemId : 'operation'
		}, {
			fieldLabel : T('label.description'),
			name : 'operation_desc',
			itemId : 'operation_desc'
		}, {
			fieldLabel : T('label.machine'),
			name : 'machine',
			itemId : 'machine'
		}, {
			fieldLabel : T('label.description'),
			name : 'machine_desc',
			itemId : 'machine_desc'
		}, {
			fieldLabel : T('label.product'),
			name : 'product',
			itemId : 'product'
		}, {
			fieldLabel : T('label.description'),
			name : 'product',
			itemId : 'product_desc'
		}, {
			fieldLabel : T('label.priority'),
			name : 'priority',
			itemId : 'priority'
		}, {
			fieldLabel : T('label.lot_qty'),
			name : 'pallet_qty',
			itemId : 'lot_size'
		}, {
			fieldLabel : T('label.plan_qty'),
			name : 'plan',
			itemId : 'plan'
		}, {
			fieldLabel : T('label.actual'),
			name : 'actual',
			itemId : 'actual'
		}, {
			fieldLabel : T('label.rework'),
			name : 'rework',
			itemId : 'rework'
		}, {
			fieldLabel : T('label.defect'),
			name : 'defect',
			itemId : 'defect'
		} ]
	} ]
});
/**
 * Manual Output
 */
Ext.define('Ops.view.scan.ManualOutput', {
	
	extend: 'Base.abstract.Popup',

	xtype: 'ops_scan_manual',
	
	title : T('button.manual_output'),
	
	height : 485,
	
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'keypad', 'save', 'close']
	} ],
	
	items: [ {
		xtype : 'panel',
		title : T('title.prod_info'),
		layout : 'column',
		cls : 'infoFields2Column marginB20',
		defaultType : 'displayfield',
		items : [ {
			fieldLabel : T('label.date'),
			name : 'date',
			itemId : 'date',
			value : HF.setting.get('option-work_date_disp')
		}, {
			fieldLabel : T('label.shift'),
			name : 'shift',
			itemId : 'shift',
			value : HF.setting.get('option-shift_name')
		}, {
			xtype: 'displayfield',
			fieldLabel: T('label.operation'),
			itemId : 'operation'
		}, {
			xtype: 'displayfield',
			fieldLabel: T('label.machine'),
			itemId : 'machine'
		}, {
			fieldLabel : T('label.product'),
			itemId : 'product'
		}, {
			fieldLabel : T('label.description'),
			itemId : 'product_desc'
		},	{
			fieldLabel : T('label.plan_qty'),
			itemId : 'plan_qty'
		}, {
			fieldLabel : T('label.actual'),
			itemId : 'actual_qty'
		} ]
	}, {
		xtype : 'numberfield',
		minValue : 1,
		name : 'qty',
		itemId : 'qty',
		fieldLabel : T('label.actual_qty'),
		maxValue : 10000,
		minValue : -10000
	}, {
		fieldLabel : T('label.reason'),
		cls : 'marginT10',
		xtype : 'textarea',
		name : 'reason',
		itemId : 'reason'
	} ]
});

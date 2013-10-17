/**
 * Print Setting
 */
Ext.define('Ops.view.prt.PrintSetting', {
	
	extend : 'Base.abstract.Popup',

	xtype : 'ops_prt_setting',
	
	title : T('button.print') + ' ' + T('button.setting'),
	
	dockedItems : [ {
		xtype: 'controlbar',
		items: ['->', 'save', 'connect', 'test', 'close']
	} ],
	
	layout : {
		type: 'vbox',
		align: 'stretch'
	},
	
	height : 250,
	
	initComponent : function() {
		this.items = [ 
			this.createFormPart(this)
		];
		
		this.callParent();
	},
	
	createFormPart : function(view) {
		return {
			xtype : 'form',
			flex : 1,
			layout : {
				type : 'vbox',
				align : 'stretch',
			},
			items : [ {
				fieldLabel : 'Printer Agent URL',
				labelWidth : 70,
				allowBlank : false,
				name : 'agent_url',
				xtype : 'textfield',
				itemId : 'agent_url',
				value : HF.setting.get('setting-agent-url'),
				margin : '0 0 20 0'
			}, {
				fieldLabel : 'Print Interval (Sec)',
				labelWidth : 70,
				allowBlank : false,
				name : 'print_interval',
				xtype : 'numberfield',
				itemId : 'print_interval',
				minValue : 3,
				maxValue : 10,
				value : HF.setting.get('setting-print_interval')
			} ]
		}
	}
});
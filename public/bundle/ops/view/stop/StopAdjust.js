/**
 * LineStop Adjust
 */
Ext.define('Ops.view.stop.StopAdjust', {
	
	extend : 'Base.abstract.Popup',
	
	requires : ['Ext.ux.CheckColumn', 'Base.view.common.DatetimeCombo', 'Ops.store.HourStore', 'Ops.store.MinStore'],

	xtype : 'ops_stop_adjust',
	
	width : 900,
	
	height : 615,
	
	title : T('title.line_stop_adjust'),
	
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'save', 'close']
	} ],
	
	items: [ {
		layout : 'column',
		defaultType : 'displayfield',
		xtype : 'panel',
		cls : 'infoFields2Column marginB10',
		title : T('title.line_stop_report_info'),
		items : [ {
			fieldLabel : T('label.operation'),
			itemId : 'operation',
			flex : 1
		}, {
			fieldLabel : T('label.machine'),
			itemId : 'machine',
			flex : 1
		}, {
			xtype: 'displayfield',
			fieldLabel : T('label.line_stop_flag'),
			itemId : 'line_stop_flag',
			flex : 1
		}, {
			xtype: 'displayfield',
			fieldLabel: T('label.reporter'),
			itemId : 'reporter',
			flex : 1
		}, {
			xtype : 'displayfield',
			fieldLabel : T('label.event_time'),
			itemId : 'event_time',
			flex : 1
		}, {
			xtype : 'displayfield',
			fieldLabel : T('label.description'),
			itemId : 'reporter_comment',
			flex : 1
		} ]
	}, {
		xtype : 'form',
		flex : 1,
		items : [ {
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			defaultType : 'displayfield',
			xtype : 'panel',
			title : T('title.line_maintenance_info'),
			flex : 1,
			items : [ {
				name : 'id',
				itemId : 'machine_loss_id',
				hidden : true
			}, {
				fieldLabel : T('label.maintainer'),
				flex : 1,
				name : 'maintainer',
				xtype : 'entityfield',
				pickerConfig : {
					column_1_data_index : 'login',
					column_1_empty_text : T('label.login'),
					column_2_data_index : 'name',
					column_2_empty_text : T('label.name')
				},
				storeClass : 'Base.store.User',
				allowBlank : false
			}, {
				xtype: 'numberfield',
				name : 'maintainer_count',
				fieldLabel: T('label.worker_count'),
				flex : 1,
				allowBlank : false,
				minValue : 0,
				value : 1
			} ]
		}, {
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			defaultType : 'textfield',
			xtype : 'panel',
			flex : 1,
			items : [ {
				xtype : 'datetimecombo',
				cls : 'marginT10',
				name : 'maint_start_time',
				itemId : 'maint_start_time',
				fieldLabel : T('label.maint_start_time'),
				initValue : new Date() // TODO 디폴트로 신고 시간 
			},	{
				xtype : 'datetimecombo',
				cls : 'marginT10',
				name : 'maint_end_time',
				itemId : 'maint_end_time',
				fieldLabel : T('label.maint_end_time'),
				initValue : new Date() // 디폴트로 현재 시간
			}, {
				fieldLabel : T('label.breakdown_code'),
				cls : 'marginT10',
				name : 'breakdown_code',
				itemId : 'breakdown_code',
				xtype : 'codecombo',
				commonCode : 'BREAKDOWN_CODE',
				displayField : 'description',
				flex : 1,
				allowBlank : false
			}, {
				xtype : 'textareafield',
				cls : 'marginT10 marginB10',
				fieldLabel : T('label.description'),
				name : 'maint_comment',
				flex : 1,
				maxLength : 1300
			} ]
		} ]
	} ]
});
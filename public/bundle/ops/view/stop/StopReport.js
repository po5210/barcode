/**
 * LineStop Report
 */
Ext.define('Ops.view.stop.StopReport', {
	
	extend : 'Base.abstract.Popup',
	
	requires : ['Ext.ux.CheckColumn', 'Base.view.common.DatetimeCombo'],

	xtype : 'ops_stop_report',
	
	title : T('title.line_stop_report'),
	
	dockedItems : [ {
		xtype : 'controlbar',
		items : ['->', 'save', 'close']
	} ],
	
	layout : {
		type: 'vbox',
		align: 'stretch'
	},
	
	height : 490,

	items: [ {
		xtype : 'panel', 
		layout : 'column',
		cls : 'infoFields2Column',
		defaultType : 'displayfield',
		items: [ {
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
			fieldLabel : T('label.operation'),
			itemId : 'operation'
		},	{
			fieldLabel : T('label.machine'),
			itemId : 'machine'
		} ]
	}, {
		xtype : 'form',
		flex : 1,
		cls : 'marginT10',
		layout : {
			type : 'vbox',
			align : 'stretch'
		},
		items : [ {
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			xtype : 'panel',
			items : [ {
				name : 'line_stop_flag',
				fieldLabel : T('label.line_stop_flag'),
				itemId : 'line_stop_flag',
				xtype : 'checkboxfield',
				inputValue : true,
				flex : 1
			}, {
				fieldLabel : T('label.reporter'),
				flex : 2,
				name : 'reporter',
				itemId : 'reporter',
				xtype : 'entityfield',
				pickerConfig : {
					column_1_data_index : 'login',
					column_1_empty_text : T('label.login'),
					column_2_data_index : 'name',
					column_2_empty_text : T('label.name')
				},
				storeClass : 'Base.store.User',
				allowBlank : false
			} ]
		}, {
			fieldLabel : T('label.breakdown_code'),
			cls : 'marginT10',
			name : 'breakdown_code',
			itemId : 'breakdown_code',
			xtype : 'codecombo',
			commonCode : 'BREAKDOWN_CODE',
			displayField : 'description',
			allowBlank : false
		}, {
			xtype : 'datetimecombo',
			cls : 'marginT10',
			name : 'event_time',
			itemId : 'event_time',
			fieldLabel : T('label.event_time')
		}, {
			xtype : 'textareafield',
			cls : 'marginT10',
			name : 'reporter_comment',
			itemId : 'reporter_comment',
			fieldLabel : T('label.reporter_comment'),
			maxLength : 1300
		} ]
	} ]	
});
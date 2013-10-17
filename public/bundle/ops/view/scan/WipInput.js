/**
 * WIP Input
 */
Ext.define('Ops.view.scan.WipInput', {
	
	extend: 'Base.abstract.Popup',

	xtype: 'ops_scan_wip_input',
	
	height : 420,
	
	title : T('button.wip_input'),
	
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	
	items: [ {
		xtype : 'panel',
		layout : 'column',
		cls : 'infoFields2Column marginB20',
		defaultType : 'displayfield',
		items : [ {
			fieldLabel : T('label.operation'),
			itemId : 'operation',
			value : HF.setting.get('option-operation').name
		}, {
			fieldLabel : T('label.operation_desc'),
			itemId : 'operation_desc',
			value : HF.setting.get('option-operation_info').description
		} ]
	}, {
		itemId : 'prod_label_scan',
		cls : 'marginB20',
		items: [ {
			layout : 'hbox',
			items : [ {
				xtype : 'textfield',
				flex : 0.9,
				fieldLabel : T('label.label'),
				name : 'label',
				id : 'text_label',
				itemId : 'text_label',
				enableKeyEvents : true,
				allowBlank : false
			}, {
				xtype: 'button',
				itemId : 'btn_ok',
				text : 'OK',
				width : 70
			}, {
				width : 10
			} ]
		}, {
			xtype: 'image',
			src: 'theme/imageOPS/scan.png'
		} ]
	} ]
});

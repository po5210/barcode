/**
 * Touch Pad Popup
 */
Ext.define('Ops.view.cmm.TouchPadPopup', {
	
	extend: 'Base.abstract.Popup',

	xtype: 'ops_touch_pad_popup',
	
	cls : 'touch_pad_popup',
	
	title : T('button.keypad'),
		
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	
	width : 400,
	
	height : 500,
	
	items : [ {
		xtype : 'container',
		padding : '0 0 10 0',
		layout : {
			type : 'hbox',
			align : 'stretch'
		},
		items : [ {
			xtype : 'textfield',
			flex : 1
		} ]
	}, {
		xtype : 'container',
		flex : 1,
		padding : '0 0 5 0',
		layout : {
			type : 'hbox',
			align : 'stretch'
		},
		items : [ {
			xtype : 'button',
			itemId : 'input_h',
			text : 'h',
			margin : '0 5 0 0',
			flex : 1
		}, {
			xtype : 'button',
			itemId : 'input_s',
			text : 's',
			margin : '0 5 0 0',
			flex : 1
		}, {
			xtype : 'button',
			itemId : 'input_semicolon',
			text : ':',
			flex : 1
		} ]
	}, {
		xtype : 'container',
		flex : 1,
		padding : '0 0 5 0',
		layout : {
			type : 'hbox',
			align : 'stretch'
		},
		items : [ {
			xtype : 'button',
			itemId : 'input_1',
			text : '1',
			margin : '0 5 0 0',
			flex : 1
		}, {
			xtype : 'button',
			itemId : 'input_2',
			text : '2',
			margin : '0 5 0 0',
			flex : 1
		}, {
			xtype : 'button',
			itemId : 'input_3',
			text : '3',
			flex : 1
		} ]
	}, {
		xtype : 'container',
		flex : 1,
		padding : '0 0 5 0',
		layout : {
			type : 'hbox',
			align : 'stretch'
		},
		items : [ {
			xtype : 'button',
			itemId : 'input_4',
			text : '4',
			margin : '0 5 0 0',
			flex : 1
		}, {
			xtype : 'button',
			itemId : 'input_5',
			text : '5',
			margin : '0 5 0 0',
			flex : 1
		}, {
			xtype : 'button',
			itemId : 'input_6',
			text : '6',
			flex : 1
		} ]
	}, {
		xtype : 'container',
		flex : 1,
		padding : '0 0 5 0',
		layout : {
			type : 'hbox',
			align : 'stretch'
		},
		items : [ {
			xtype : 'button',
			itemId : 'input_7',
			text : '7',
			margin : '0 5 0 0',
			flex : 1
		}, {
			xtype : 'button',
			itemId : 'input_8',
			text : '8',
			margin : '0 5 0 0',
			flex : 1
		}, {
			xtype : 'button',
			itemId : 'input_9',
			text : '9',
			flex : 1
		} ]
	}, {
		xtype : 'container',
		flex : 1,
		padding : '0 0 5 0',
		layout : {
			type : 'hbox',
			align : 'stretch'
		},
		items : [ {
			xtype : 'button',
			itemId : 'input_minus',
			text : '-',
			margin : '0 5 0 0',
			flex : 1
		}, {
			xtype : 'button',
			itemId : 'input_0',
			text : '0',
			margin : '0 5 0 0',
			flex : 1
		}, {
			xtype : 'button',
			itemId : 'ctrl_delete',
			text : T('button.delete'),
			flex : 1
		} ]
	}, {
		xtype : 'container',
		flex : 1,
		padding : '0 0 10 0',
		layout : {
			type : 'hbox',
			align : 'stretch'
		},
		items : [ {
			xtype : 'button',
			itemId : 'ctrl_clear',
			text : T('button.clear'),
			margin : '0 5 0 0',
			flex : 1
		}, {
			xtype : 'button',
			itemId : 'ctrl_confirm',
			text : 'OK',
			margin : '0 5 0 0',
			flex : 1
		}, {
			xtype : 'button',
			itemId : 'ctrl_close',
			text : T('button.close'),
			flex : 1
		} ]
	} ]
});

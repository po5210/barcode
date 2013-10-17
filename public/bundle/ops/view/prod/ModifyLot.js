/**
 * Modify Lot
 */
Ext.define('Ops.view.prod.ModifyLot', {
	
	extend : 'Base.abstract.Popup',
	
	xtype : 'ops_prod_modify_lot',
	
	title : T('label.modify_actual'),
	
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'save', 'close']
	} ],
	
	height : 430,
	
	initComponent : function() {
		this.items = [ 
			this.createInfoPart(this),
			this.createInputPart(this)
		];
		this.callParent();
	},
	
	createInfoPart : function(view) {
		return {
			xtype : 'panel',
			layout : 'column',
			cls : 'infoFields2Column',
			defaultType : 'displayfield',
			items : [ {
				fieldLabel : T('label.date'),
				name : 'date',
				itemId : 'date'
			}, {
				fieldLabel : T('label.shift'),
				name : 'shift',
				itemId : 'shift'
			}, {
				fieldLabel : T('label.operation'),
				name : 'operation',
				itemId : 'operation'
			}, {
				fieldLabel : T('label.machine'),
				name : 'machine',
				itemId : 'machine'
			}, {
				fieldLabel : T('label.product'),
				name : 'product',
				itemId : 'product'
			}, {
				fieldLabel : T('label.description'),
				name : 'product_desc',
				itemId : 'product_desc'
			}, {
				fieldLabel : T('label.actual_qty'),
				name : 'actual_qty',
				itemId : 'actual_qty'
			}, {
				fieldLabel : T('label.scan_time'),
				name : 'scan_time',
				itemId : 'scan_time'
			} ]
		}
	},
	
	createInputPart : function(view) {
		return {
			xtype : 'form',
			cls : 'marginT10',
			flex : 0.14,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items : [ {
				xtype : 'container',
				layout : {
					type : 'hbox',
					align : 'stretch'
				},
				items : [ {
					fieldLabel : T('label.modify_qty'),
					xtype : 'numberfield',
					name : 'modify_qty',
					flex : 1,
					itemId : 'modify_qty',
					value : 0,
					minValue : -1000,
					maxValue : 1000,
					flex : 1
				}, {
					xtype : 'button', 
					width : 80, 
					text : T('button.keypad'),
					margin : '0 5 0 5',
					align : 'center', 
					itemId : 'keypad'
				} ]
			}, {
				xtype : 'textareafield',
				itemId : 'description',
				name : 'description',
				cls : 'marginT10',
				fieldLabel : T('label.reason'),
				allowBlank : false
			} ]
		};
	}
});
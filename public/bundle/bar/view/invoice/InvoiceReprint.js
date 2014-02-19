/**
 * Add Scrap
 */
Ext.define('Bar.view.invoice.InvoiceReprint', {
	
	extend : 'Base.abstract.Popup',
	
	requires : ['Ext.ux.CheckColumn'],

	xtype : 'bar_invoice_reprint',
	
	title : T('label.defect'),
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'reprint', 'close']
	} ],
	
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	
	height : 550,
	
	y : 5,
	
	initComponent : function() {
		this.items = [ 
			this.createReworkPart(this)
		];
		
		this.callParent();
	},
	
	createReworkPart : function(view) {
		return {
			xtype : 'panel',
			cls : 'marginB20',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [ {
				xtype : 'container',
				layout : {
					type : 'hbox',
					align : 'stretch'
				},
				items : [ {
					fieldLabel : T('label.rework_qty'),
					xtype : 'numberfield',
					name : 'rework_qty',
					width : 220,
					itemId : 'rework_qty',
					value : 0,
					minValue : 0,
					flex : 1
				}, {
					xtype : 'button', 
					width : 80, 
					text : T('button.keypad'),
					margin : '0 5 0 5',
					align : 'center', 
					itemId : 'rework_keypad'
				} ]
			} ]
		};
	}
	
});
/**
 * Shipping Main View
 */
Ext.define('Ops.view.ship.ShipMain', {
	
	extend: 'Base.abstract.Form',
	
	xtype: 'ops_ship_main',
	
	title : T('menu.OpsShip'),
	
	layout : 'border',
	
	defaults: {
	    collapsible : false,
	    split : false,
	    bodyStyle : 'padding:15px'
	},
	
	dockedItems: [ {
		xtype : 'toolbar',
		dock : 'bottom',
		items : [ '->', {
			itemId : 'btn_new_shipping',
			text : T('button.new_shipping')
		}, {
			itemId : 'btn_abort_shipping',
			text : T('button.abort_shipping')
		}, {
			itemId : 'btn_finish_shipping',
			text : T('button.finish_shipping')
		}, {
			itemId : 'btn_reprint',
			text : T('button.reprint')
		} ]
	} ],

	items : [ {
		title: 'Selection',
		region: 'north',
		xtype : 'panel', 
		margin : '0 8 0 8',
		padding : '10 10 0 10',
		layout : 'column',
		cls : 'infoFields2Column',
		items : [ {
			fieldLabel : T('title.customer'),
			name : 'customer',
			xtype : 'entitysearchcombo',
			storeClass : 'Prod.store.Customer',
			itemId : 'current_customer'
		}, {
			fieldLabel : T('label.product'),
			name : 'product',
			xtype : 'entitysearchcombo',
			storeClass : 'Prod.store.Product',
			itemId : 'current_product'
		} ]
	}, {
		region : 'center',
		xtype : 'panel',
		layout : {
			type : 'vbox',
			align : 'stretch'
		},
		items : [ {
			xtype : 'panel',
			title : 'Scan Container Lot',
			layout : 'hbox',
			padding : '0 0 10 0',
			items : [ {
				xtype : 'textfield',
				name : 'scan_lot',
				itemId : 'scan_lot',
				disabled : true,
				flex : 1
			}, {
				xtype: 'button',
				itemId : 'btn_ok',
				text : 'OK',
				width : 70
			}, {
				width : 5
			} ],
		}, {
			xtype : 'panel',
			title : 'Container Lot List',
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			flex : 1,
			items : [ {
				xtype : 'grid',
				itemId : 'leftgrid',
				autoScroll : false,
				flex : 1,
				store : Ext.create('Ext.data.Store', {
					fields : [ {
						name: 'row_idx', type : 'integer'
					}, {
						name: 'col_idx', type : 'integer'
					}, {
						name: 'seq', type : 'integer'
					}, {
						name: 'name', type : 'string'
					}, {
						name: 'product_id', type : 'string'
					}, {
						name: 'total_qty', type : 'integer'
					} ],
					/*data : [ {
						'seq' : 1,
						'row_idx' : 1,
						'col_idx' : 1,
						'name' : '',
						'product_id' : '',
						'total_qty' : 0
					}, {
						'seq' : 3,
						'row_idx' : 2,
						'col_idx' : 1,
						'name' : '',
						'product_id' : '',
						'total_qty' : 0
					}, {
						'seq' : 5,
						'row_idx' : 3,
						'col_idx' : 1,
						'name' : '',
						'product_id' : '',
						'total_qty' : 0
					}, {
						'seq' : 7,
						'row_idx' : 4,
						'col_idx' : 1,
						'name' : '',
						'product_id' : '',
						'total_qty' : 0
					} ]*/
				}),
				columns: [ {
					dataIndex : 'row_idx',
					hidden : true,
					width : 0
				}, {
					dataIndex : 'col_idx',
					hidden : true,
					width : 0
				}, {
					header : '',
					dataIndex : 'seq',
					width : 40,
					align : 'right'
				}, {
					header: T('label.container_lot'),
					dataIndex: 'name',
					flex : 1.5
				}, {
					header: T('label.product'),
					dataIndex: 'product_id',
					width: 145,
					renderer : function(val) {
						return HF.idToName(val);
					}
				}, {
					header: T('label.qty'),
					dataIndex: 'total_qty',
					width : 60,
					align : 'right'
				} ]
			}, {
				xtype : 'displayfield',
				width : 10
			}, {
				xtype : 'grid',
				itemId : 'rightgrid',
				autoScroll : false,
				flex : 1,
				store : Ext.create('Ext.data.Store', {
					fields : [ {
						name: 'row_idx', type : 'integer'
					}, {
						name: 'col_idx', type : 'integer'
					}, {
						name: 'seq', type : 'integer'
					}, {
						name: 'name', type : 'string'
					}, {
						name: 'product_id', type : 'string'
					}, {
						name: 'total_qty', type : 'integer'
					} ],
					/*data : [ {
						'seq' : 2,
						'row_idx' : 1,
						'col_idx' : 2,
						'name' : '',
						'product_id' : '',
						'total_qty' : 0
					}, {
						'seq' : 4,
						'row_idx' : 2,
						'col_idx' : 2,
						'name' : '',
						'product_id' : '',
						'total_qty' : 0
					}, {
						'seq' : 6,
						'row_idx' : 3,
						'col_idx' : 2,
						'name' : '',
						'product_id' : '',
						'total_qty' : 0
					}, {
						'seq' : 8,
						'row_idx' : 4,
						'col_idx' : 2,
						'name' : '',
						'product_id' : '',
						'total_qty' : 0
					} ]*/
				}),
				columns: [ {
					dataIndex : 'row_idx',
					hidden : true,
					width : 0
				}, {
					dataIndex : 'col_idx',
					hidden : true,
					width : 0
				}, {
					header : '',
					dataIndex : 'seq',
					width : 40,
					align : 'right'
				}, {
					header: T('label.container_lot'),
					dataIndex: 'name',
					flex : 1.5
				}, {
					header: T('label.product'),
					dataIndex: 'product_id',
					width: 145,
					renderer : function(val) {
						return HF.idToName(val);
					}
				}, {
					header: T('label.qty'),
					dataIndex: 'total_qty',
					width : 60,
					align : 'right'
				} ]
			} ]
		} ]
	} ]
});

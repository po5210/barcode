/**
 * Packing Main View
 */
Ext.define('Ops.view.pack.PackingMain', {
	
	extend: 'Base.abstract.Form',
	
	xtype: 'ops_packing_main',
	
	title : T('menu.OpsPacking'),
	
	layout : 'border',
	
	autoScroll : false,
	
	defaults: {
	    collapsible : false,
	    split : false,
	    bodyStyle : 'padding:15px'
	},
	
	dockedItems: [ {
		xtype : 'toolbar',
		dock : 'bottom',
		items : [ '->', {
			itemId : 'btn_new_rack',
			text : T('button.new')
		}, {
			itemId : 'btn_current_rack',
			text : T('button.reset'),
			disabled : true
		}, {
			itemId : 'btn_abort_rack',
			text : T('button.abort'),
			disabled : true
		}, {
			itemId : 'btn_finish_rack',
			text : T('label.finish'),
			disabled : true
		}, {
			itemId : 'btn_reprint',
			text : T('button.reprint'),
			disabled : true
		}, {
			itemId : 'btn_print_setting',
			text : T('button.print') + ' ' + T('button.setting')
		} ]
	} ],

	items : [ {
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
			itemId : 'current_customer',
			flex : 1
		}, {
			fieldLabel : T('label.product'),
			name : 'product',
			xtype : 'entitysearchcombo',
			storeClass : 'Prod.store.Product',
			itemId : 'current_product',
			flex : 1
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
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			items : [ {
				xtype : 'fieldset',
				title : '',
				flex : 1,
				items : [ {
					xtype : 'fieldcontainer',
					fieldLabel : '',
					layout : { type : 'vbox', align : 'stretch' },
					defaultType : 'displayfield',
					items : [ {
						labelStyle : "font-wieght:bold;font-size:25px",
						fieldStyle : "font-size:45px",
						labelSeparator: ' 	',
						fieldLabel : '<h1>Total</h1>',
						flex : 1,
						padding : '0 0 0 10',
						value : '0',
						itemId : 'total_in_shift'
					} ]
				} ]
			}, {
				xtype : 'displayfield',
				width : 10
			}, {
				xtype : 'fieldset',
				title : '',
				flex : 1,
				items : [ {
					xtype : 'fieldcontainer',
					fieldLabel : '',
					layout : { type : 'vbox', align : 'stretch' },
					defaultType : 'displayfield',
					items : [ {
						labelStyle : "font-wieght:bold;font-size:25px",
						fieldStyle : "font-size:45px",
						labelSeparator: ' 	',
						fieldLabel : '<h1>Rack</h1>',
						flex : 1,
						padding : '0 0 0 10',
						value : '0',
						itemId : 'rack_pack'
					} ]
				} ]
			}, {
				xtype : 'displayfield',
				width : 10
			}, {
				xtype : 'fieldset',
				title : '',
				flex : 1,
				items : [ {
					xtype : 'fieldcontainer',
					fieldLabel : '',
					layout : { type : 'vbox', align : 'stretch' },
					defaultType : 'displayfield',
					items : [ {
						labelStyle : "font-wieght:bold;font-size:25px",
						fieldStyle : "font-size:45px",
						labelSeparator: ' 	',
						fieldLabel : '<h1>Current</h1>',
						flex : 1,
						padding : '0 0 0 10',
						value : '0',
						itemId : 'current_count'
					} ]
				} ]
			}, {
				xtype : 'displayfield',
				width : 10
			} ]
		}, {
			xtype : 'panel',
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			flex : 1,
			items : [ {
				xtype : 'grid',
				scroll : true,
				itemId : 'leftgrid',
				flex : 1.5,
				store: Ext.create('Ext.data.Store', {
					fields : [ {
						name : 'id', type : 'string'
					}, {
						name : 'name', type : 'string'
					}, {
						name : 'qty', type : 'integer'
					}, {
						name : 'created_at', type : 'date'
					} ]
				}),
				columns: [ {
					xtype : 'rownumberer',
					width : 35
				}, {
					dataIndex : 'id',
					hidden : true
				}, {
					dataIndex : 'name',
					header : T('label.serial_no'),
					flex : 1
				}, {
					dataIndex : 'qty',
					header : T('label.qty'),
					flex : 0.5
				}, {
					header : T('label.scan_time'),
					dataIndex : 'created_at',
					flex : 1.5,
					align : 'center'
				} ]
			}, {
				xtype : 'displayfield',
				width : 10
			}, {
				xtype : 'panel',
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				flex: 1,
				items : [ {
					xtype : 'panel',
					layout : 'hbox',
					items : [ {
						xtype : 'textfield',
						name : 'scan_lot',
						itemId : 'scan_lot',
						disabled : true,
						flex : 1,
						enableKeyEvents : true
					}, {
						xtype: 'button',
						itemId : 'btn_ok',
						text : 'OK',
						width : 70
					}, {
						width : 5
					} ],
				}, {
					xtype : 'grid',
					scroll : true,
					itemId : 'rightgrid',
					padding : '5 0 0 0',
					flex : 1,
					store : Ext.create('Ext.data.Store', {
						fields : [ {
							name : 'id', type : 'string'
						}, {
							name : 'product_id', type : 'string'
						}, {
							name : 'created_at', type : 'date'
						} ]
					}),
					columns : [ {
						xtype : 'rownumberer',
						width : 35
					}, {
						dataIndex : 'id',
						hidden : true
					}, {
						dataIndex : 'product_id',
						header : T('label.product'),
						flex : 1,
						renderer : function(val) {
							return HF.idToName(val);
						}
					}, {
						header : T('label.scan_time'),
						dataIndex : 'created_at',
						flex : 1.5,
						align : 'center'
					} ]
				} ]
			} ]
		} ]
	} ]
});

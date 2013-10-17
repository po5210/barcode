/**
 * Production Status Main View
 */
Ext.define('Ops.view.prod.ProdMain', {
	
	extend: 'Base.abstract.Form',
	
	required : ['Ops.store.ProdMain'],

	xtype: 'ops_prod_main',
	
	title : T('title.prod_state'),
	
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	
	dockedItems: [ {
		xtype : 'toolbar',
		dock : 'bottom',
		items : [ {
			itemId : 'btn_show_hide',
			text : T('button.show')
		}, {
			itemId : 'btn_up',
			text : T('button.moveup')
		}, {
			itemId : 'btn_down',
			text : T('button.movedown')
		}, '->',  {
			itemId : 'btn_prod_list',
			text : T('button.modify_actual')
		}, {
			itemId : 'btn_modify_operator',
			text : T('button.modify_operator')
		}, {
			itemId : 'btn_add_plan',
			text : T('button.add_plan')
		}, {
			itemId : 'btn_scrap',
			text : T('button.defect')
		}, {
			itemId : 'btn_line_stop',
			text : T('button.line_stop')
		}, {
			itemId : 'btn_manual_output',
			text : T('button.manual_output')
		}/*, {
			itemId : 'btn_mold_breakdown',
			text : T('button.mold_breakdown')
		}, {
			itemId : 'btn_wip_input',
			text : T('button.wip_input')			
		}, {
			itemId : 'btn_prod_input',
			text : T('button.prod_input')
		}, {
			itemId : 'btn_req_mat',
			text : T('button.req_mat')
		}*/ ]
	} ],

	items : [ {
		xtype : 'grid',
		scroll: true,
		flex : 1,
		// TODO 추후 ProdOrder Store로 변경 
		store : Ext.create('Ops.store.ProdMain'),
		columns : [ {
			header : T('label.status'),
			xtype : 'actioncolumn',
			itemId : 'status',
			width : 60,
			align : 'center',
			renderer : function(value, metaData, record, row, col, store, gridView) {
				if(record.get("status") == "W") {
					return "<img src='theme/imageOPS/wait.png'/>";
				} else if(record.get("status") == "R") {
					return "<img src='theme/imageOPS/start.png'/>";
				} else {
					return "<img src='theme/imageOPS/finish.png'/>";
				}
			}
		}, {
			header : T('label.mc'),
			dataIndex : 'machine',
			width : 115
		}, {
			header : T('label.mc_desc'),
			dataIndex : 'machine_desc',
			flex : 0.8,
			align : 'left'
		}, {
			header : T('label.product'),
			dataIndex : 'product',
			width : 150
		}, {
			header : T('label.product_desc'),
			dataIndex : 'product_desc',
			flex : 1,
			align : 'left'
		}, {
			header : T('label.priority'),
			dataIndex : 'order_seq',
			width : 65,
			align : 'right'
		}, {
			header : T('label.plan_qty'),
			dataIndex : 'order_qty',
			xtype : 'numbercolumn',
			format : T('format.number'),
			width : 70,
			align : 'right'
		}, {
			header : T('label.actual'),
			dataIndex : 'actual_qty',
			xtype : 'numbercolumn',
			format : T('format.number'),
			width : 70,
			align : 'right'
		}, {
			header : T('label.defect'),
			dataIndex : 'defect_qty',
			width : 60,
			align : 'right'
		}, {
			header : T('label.rework'),
			dataIndex : 'rework_qty',
			width : 70,
			align : 'right'
		}, {
			hidden : true,
			dataIndex : 'pallet_qty',
			header : ''
		} , {
			xtype : 'datecolumn',
			header : T('label.start'),
			dataIndex : 'actual_start_time',
			format : T('format.time_without_sec'),
			align : 'center',
			width : 68
		}, {
			xtype : 'datecolumn',
			header : T('label.end'),
			dataIndex : 'actual_end_time',
			format : T('format.time_without_sec'),
			align : 'center',
			width : 68
		}, {
			header : T('label.scan'),
			xtype : 'actioncolumn',
			itemId : 'scan',
			width : 60,
			align : 'center',
			renderer : function(value, metaData, record, row, col, store, gridView) {
				if(record.get("status") == "R") {
					return "<img src='theme/imageOPS/btnScan.png'/>";
				}
			}
		} ]
	} ]
});

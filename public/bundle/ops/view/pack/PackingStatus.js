/**
 * Packing Status
 */
Ext.define('Ops.view.pack.PackingStatus', {
	
	extend: 'Base.abstract.Panel',

	xtype: 'ops_pack_status',
	
	requires : ['Pck.store.Packing'],
	
	title : T('menu.OpsPackStatus'),
	
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	
	store : Ext.create('Pck.store.Packing'),
	
	dockedItems: [ {
		xtype : 'toolbar',
		dock : 'bottom',
		items : [ '->', {
			itemId : 'btn_uncheck_all',
			text : T('button.uncheck_all')
		}, {
			itemId : 'btn_check_all',
			text : T('button.check_all')
		}, {
			itemId : 'btn_send',
			text : T('button.send')
		} ]
	} ],
	
	initComponent : function() {
		this.items = [ 
			this.createGridPart(this),
		];
		
		this.callParent();
		var pagingtoolbar = this.down(' pagingtoolbar');
		pagingtoolbar.bindStore(this.store);
		
		this.store.on('load', function(store) {
			if(store.getTotalCount() > store.getCount()) {
				pagingtoolbar.show();
			} else {
				pagingtoolbar.hide();
			}
		});
	},
	
	createGridPart : function(view) {
		return {
			xtype : 'grid',
			flex : 1,
			scroll : true,
			store : this.store,
			columns : [ {
				dataIndex : 'id',
				hidden : true
			}, {
				header : T('label.check'),
				xtype : 'actioncolumn',
				itemId : 'status',
				width : 60,
				align : 'center',
				renderer : function(value, metaData, record, row, col, store, gridView) {
					if(record.get("status") == '0') {
						return "<img src=\"theme/imageOPS/wait.png\"/>";
					} else if(record.get("status") == '1') {
						return "<img src=\"theme/imageOPS/start.png\"/>";
					} 
				}
			}, {
				xtype : 'datecolumn',
				header : T('label.work_date'),
				dataIndex : 'work_date',
				format : T('format.date'),
				align : 'center',
				width : 100
			}, {
				header : T('label.serial_no'),
				dataIndex : 'name',
				width : 100
			}, {
				header : T('label.operation'),
				dataIndex : 'operation',
				xtype : 'entitycolumn',
				width : 80
			}, {
				header : T('label.operation_desc'),
				dataIndex : 'operation',
				width : 120,
				renderer : function(value, metaData, record, row, col, store, gridView) {
					return record.get('operation').desc;
				}
			}, {
				header : T('label.product'),
				dataIndex : 'product',
				xtype : 'entitycolumn',
				width : 140
			}, {
				header : T('label.product_desc'),
				dataIndex : 'product',
				flex : 1,
				renderer : function(value, metaData, record, row, col, store, gridView) {
					return record.get('product').desc;
				}
			}, {
				header : T('title.customer'),
				dataIndex : 'customer',
				xtype : 'entitycolumn',
				width : 110
			}, {
				header : T('label.qty'),
				dataIndex : 'qty',
				xtype : 'numbercolumn',
				align : 'right',
				format : T('format.number'),
				width : 60
			} ],
			bbar : {
				xtype : 'pagingtoolbar',
				cls : 'pagingToolbar',
		        displayInfo : true,
		        displayMsg : T('text.Paging Toolbar Display Message'),
		        emptyMsg : T('text.Paging Toolbar Empty Message'),
				hidden : true
			}
		}
	}
});

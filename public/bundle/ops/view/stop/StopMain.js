/**
 * LineStop Main
 */
Ext.define('Ops.view.stop.StopMain', {
	
	extend: 'Base.abstract.Panel',

	xtype: 'ops_stop_main',
	
	requires : ['Prod.store.MachineLoss'],
	
	title : T('title.machine_loss'),
	
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	
	store : Ext.create('Prod.store.MachineLoss'),
	
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
				xtype : 'actioncolumn',
				itemId : 'line_stop_adjust',
				align : 'center',
				width : 45,
				icon : 'theme/imageOPS/line_status_1.png'
			}, {
				xtype : 'datecolumn',
				header : T('label.work_date'),
				dataIndex : 'work_date',
				format : T('format.date'),
				align : 'center',
				width : 120
			}, {
				header : T('label.operation'),
				dataIndex : 'operation',
				xtype : 'entitycolumn',
				width : 90
			}, {
				header : T('label.operation_desc'),
				dataIndex : 'operation',
				flex : 1,
				renderer : function(value, metaData, record, row, col, store, gridView) {
					return record.get('operation').desc;
				}
			}, {
				header : T('label.mc'),
				dataIndex : 'machine',
				xtype : 'entitycolumn',
				width : 80
			}, {
				header : T('label.machine_desc'),
				dataIndex : 'machine',
				flex : 1,
				renderer : function(value, metaData, record, row, col, store, gridView) {
					return record.get('machine').desc;
				}
			}, {
				xtype : 'datecolumn',
				header : T('label.event_time'),
				dataIndex : 'event_time',
				format : T('format.time_without_sec'),
				align : 'center',
				width : 100
			}, {
				header : T('label.reporter'),
				dataIndex : 'reporter',
				xtype : 'entitycolumn',
				width : 100,
			}, {
				header : T('label.breakdown_code'),
				dataIndex : 'breakdown_code',
				xtype : 'codecolumn',
				tpl : '{description}', 
				commonCode : 'BREAKDOWN_CODE',
				width : 180
			}, {
				xtype : 'actioncolumn',
				icon : 'theme/imageOPS/line_status_2.png',
				itemId : 'line_stop_report',
				width : 45,
				align : 'center'
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

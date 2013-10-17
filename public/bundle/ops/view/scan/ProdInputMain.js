Ext.define('Ops.view.scan.ProdInputMain', {
	
	extend: 'Base.abstract.Form',

	xtype: 'ops_prod_input_main',
	
	title : T('button.prod_input'),
	
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	
	store : Ext.create('Ext.data.Store', {
		fields : [ {
			name: 'id'
		}, {
			name: 'lot_no'
		}, {
			name: 'serial_no'
		}, {
			name: 'product'
		}, {
			name: 'actual_qty'
		}, {
			name: 'inv_qty'
		}, {
			name: 'track_qty'
		}, {
			name: 'input_time'
		} ],
		
		pageSize : 25,
		
		proxy: {
			type : 'ajax',
			url : '/domains/' + login.current_domain_id + '/ops/prod_inputs.json',
			format : 'json',
			reader : {
				type : 'json',
				root: 'items',
				successProperty : 'success',
				totalProperty : 'total'
			}
		}
	}),
	
	bbar : {
		xtype : 'pagingtoolbar',
		cls : 'pagingToolbar',
        displayInfo: true,
        displayMsg: T('text.Paging Toolbar Display Message'),
        emptyMsg: T('text.Paging Toolbar Empty Message'),
		hidden : true
    },

	initComponent : function() {
		this.items = [ this.createGridPart(this) ];
		this.callParent();
		
		var pagingtoolbar = this.down('pagingtoolbar');
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
			xtype: 'grid',
			flex : 1,
			scroll: true,
			store: this.store,
			
			columns: [ {
				dataIndex: 'id',
				hidden: true
			}, {
				header: T('label.part_no'),
				dataIndex: 'product',
				flex: 1,
				renderer : function(val) {
					return val.name;
				}
			}, {
				header: T('label.part_name'),
				dataIndex: 'product',
				flex: 1.5,
				renderer : function(val) {
					return val.desc;
				}
			}, {
				header: T('label.lot_no'),
				dataIndex: 'lot_no',
				width: 75
			}, {
				header: T('label.serial_no'),
				dataIndex: 'serial_no',
				width: 90
			}, {
				header: T('label.in_qty'),
				dataIndex: 'actual_qty',
				width: 80,
				align : 'right'
			}, {
				header: T('label.remain_qty'),
				dataIndex: 'track_qty',
				width: 85,
				align : 'right'
			}, {
				xtype: 'datecolumn',
				header: T('label.in_time'),
				dataIndex: 'input_time',
				format : T('format.datetime'),
				width: 190,
				align : 'center'
			}, /*{
				xtype : 'actioncolumn',
				icon : 'theme/imageOPS/btnResultEdit.png',
				itemId : 'update_input',
				align : 'center',
				width : 45
			},*/ {
				xtype : 'actioncolumn',
				icon : 'theme/imageOPS/btnDelete.png',
				itemId : 'delete_input',
				align : 'center',
				width : 45,
				renderer : function(record) {
					// TODO record의 input_qty와 remain_qty가 동일할 경우에만 삭제 가능 
				}
			} ]
		}
	}
});

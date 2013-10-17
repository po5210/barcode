/**
 * Production List
 */
Ext.define('Ops.view.prod.ProdList', {
	
	extend : 'Base.abstract.Form',

	xtype : 'ops_prod_list',
	
	requires : ['Prod.store.Lot'],
	
	title : T('title.prod_report'),
	
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	
	dockedItems : [ {
		xtype : 'controlbar',
		items : [ '->', 'back' ]
	} ],
	
	//store : Ext.getStore('Prod.store.Lot'),
	/*store : Ext.create('Ext.data.Store', {
		fields: [ {
			name : 'prod_order_id'
		}, {
			name : 'id'
		}, {
			name : 'name'
		}, {
			name : 'product'
		}, {
			name : 'product_desc'
		}, {
			name : 'actual_qty'
		}, {
			name : 'defect_qty'
		}, {
			name : 'rework_qty'
		}, {
			name : 'tran_time',
			type : 'date'
		} ],

		sorters: [ {
			property : 'tran_time',
			direction : 'desc'
		} ],
		
		pageSize : 25,

		proxy : {
			type : 'ajax',
			url : '/domains/' + login.current_domain_id + '/lots.json',
			format : 'json',
			reader : {
				type : 'json',
				root: 'items',
				successProperty : 'success',
				totalProperty : 'total'
			}
		}
	}),*/
	
	bbar : {
		xtype : 'pagingtoolbar',
		cls : 'pagingToolbar',
        displayInfo: true,
        displayMsg: T('text.Paging Toolbar Display Message'),
        emptyMsg: T('text.Paging Toolbar Empty Message'),
		hidden : true
    },
	
	initComponent : function() {
		this.items = [ 
			this.createGridPart(this),
		];
		
		this.callParent();
		
		var store = this.child('grid').getStore();
		var pagingtoolbar = this.down('pagingtoolbar');
		pagingtoolbar.bindStore(store);
		
		store.on('load', function(store) {
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
			store : Ext.create('Prod.store.Lot', {}),
			scroll : true,
			flex : 1,
		
			columns : [ {
				header : T('label.id'),
				dataIndex : 'prod_order_id',
				hidden : true
			}, {
				header : T('label.id'),
				dataIndex : 'id',
				hidden : true
			}, {
				header : T('label.label_no'),
				dataIndex : 'name',
				width : 405
			}, {
				header : T('label.product'),
				dataIndex : 'product',
				width : 160,
				renderer : function(value) {
					return value.name;
				}
			}, {
				header : T('label.product_desc'),
				dataIndex : 'product',
				flex : 1,
				renderer : function(value) {
					return value.desc;
				}
			}, {
				header : T('label.actual_qty'),
				dataIndex : 'actual_qty',
				xtype : 'numbercolumn',
				format : T('format.number'),
				width : 70,
				align : 'right'
			}, {
				header: T('label.scan_time'),
				dataIndex: 'tran_time',
				width: 180,
				align: 'center',
				format : T('format.datetime')
			}, {
				xtype: 'actioncolumn',
				itemId : 'modify_actual',
				icon : 'theme/imageOPS/btnResultEdit.png',
				width : 50,
				align : 'center'
			}, {
				xtype : 'actioncolumn',
				align : 'center',
				itemId : 'delete_lot',
				icon: 'theme/imageOPS/btnDelete.png',
				width : 50
			} ]
		};
	}
});

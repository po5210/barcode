Ext.define('Bar.view.instock.InstockList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'bar_instock_list',
	
	//title : 'Instock Items',
	
	store : Ext.create('Ext.data.Store', {
		fields : [
			{ name : 'bill_nb', type : 'string' },
			{ name : 'item_cd', type : 'auto' },
			{ name : 'item_nm', type : 'string' },
			{ name : 'baseloc_cd', type : 'string' },
			{ name : 'loc_cd', type : 'string' },
			{ name : 'lot_size', type : 'integer' },
			{ name : 'box_qty', type : 'integer' },
			{ name : 'bill_qt', type : 'integer' },
			{ name : 'real_qt', type : 'integer' },
			{ name : 'unit_price', type : 'float' },
			{ name : '_cud_flag_', type : 'string' }
		]
	}),
	
	useDetailBtn : false,
	
	columns : [
		{ dataIndex : 'bill_seq', xtype : 'rownumberer', width : 30 },
		{ header : T('label.item'), dataIndex : 'item_cd', width : 125 },
		{ header : T('label.x_desc', {x : T('label.item')}), dataIndex : 'item_nm', flex : 1 },
		{ 
			header : T('label.baseloc_cd'), 
			dataIndex : 'baseloc_cd', 
			width : 100,
			editor : { xtype : 'textfield' }
			//editor : { xtype: 'entitycolumneditor', storeClass: 'Bar.store.BarLocmap' }			
		},
		{ 
			header : T('label.loc_cd'), 
			dataIndex : 'loc_cd', 
			width : 100,
			editor : { xtype : 'textfield' }
			//editor : { xtype: 'entitycolumneditor', storeClass: 'Bar.store.Baseloc' }			
		},
		{ header : T('label.lot_size'), dataIndex : 'lot_size', xtype : 'numbercolumn', format : T('format.number'), align : 'right', width : 85 },
		{ header : T('label.box_qty'), dataIndex : 'box_qty', xtype : 'numbercolumn', format : T('format.number'), align : 'right', width : 85 },
		{ header : T('label.bill_qty'), dataIndex : 'bill_qt', xtype : 'numbercolumn', format : T('format.number'), align : 'right', width : 85 },
		{ header : T('label.real_qty'), dataIndex : 'real_qt', xtype : 'numbercolumn', format : T('format.number'), align : 'right', width : 85 },
		{ header : T('label.unit_price'), dataIndex : 'unit_price', xtype : 'numbercolumn', format : T('format.number'), align : 'right', width : 100 },
		{ header : 'cud flag', dataIndex : '_cud_flag_', hidden : true, sortable : false, width : 0, value : '' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items : []
	} ]
});
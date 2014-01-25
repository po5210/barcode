Ext.define('Bar.view.instock.InstockList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'bar_instock_list',
	
	//title : 'Instock Items',
	
	store : 'Bar.store.Instock',
	
	useDetailBtn : false,
	
	columns : [
		{ dataIndex : 'bill_seq', xtype : 'rownumberer', width : 30 },
		{ header : T('label.item'), dataIndex : 'item_cd', width : 125 },
		{ header : T('label.x_desc', {x : T('label.item')}), dataIndex : 'item_nm', flex : 1 },
		{ header : T('label.baseloc_cd'), dataIndex : 'baseloc_cd', width : 100 },
		{ header : T('label.loc_cd'), dataIndex : 'loc_cd', width : 100 },
		{ header : T('label.lot_size'), dataIndex : 'lot_size', xtype : 'numbercolumn', format : T('format.number'), align : 'right', width : 85 },
		{ header : T('label.arrival_qty'), dataIndex : 'arrival_qty', xtype : 'numbercolumn', format : T('format.number'), align : 'right', width : 85 },
		{ header : T('label.scan_qty'), dataIndex : 'scan_qty', xtype : 'numbercolumn', format : T('format.number'), align : 'right', width : 85 },
		{ header : T('label.unit_price'), dataIndex : 'unit_price', xtype : 'numbercolumn', format : T('format.number'), align : 'right', width : 100 },
		{ header : 'cud flag', dataIndex : '_cud_flag_', hidden : true, sortable : false, width : 0, value : '' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'new', 'temp_save', 'save', 'print']
	} ]
});
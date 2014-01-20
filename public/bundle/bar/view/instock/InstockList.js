Ext.define('Bar.view.instock.InstockList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'bar_instock_list',
	
	//title : 'Instock Items',
	
	store : 'Bar.store.Instock',
	
	useDetailBtn : false,
	
	columns : [
		{ header : 'Seq.', dataIndex : 'seq', width : 45, sortOption : { sortSeq : 10, sortDirection : 'asc' } },
		{ header : T('label.product'), dataIndex : 'product', width : 125 },
		{ header : T('label.x_desc', {x : T('label.product')}), dataIndex : 'product_desc', flex : 1 },
		{ header : T('label.x_type', {x : T('label.product')}), dataIndex : 'product_type', width : 90 },
		{ header : T('label.warehouse'), dataIndex : 'warehouse', width : 80 },
		{ header : T('label.location'), dataIndex : 'location', width : 80 },
		{ header : T('label.lot_size'), dataIndex : 'lot_size', width : 85 },
		{ header : T('label.box_qty'), dataIndex : 'box_qty', width : 85 },
		{ header : T('label.ship_qty'), dataIndex : 'ship_qty', width : 85 },
		{ header : T('label.real_qty'), dataIndex : 'real_qty', width : 85 },
		{ header : 'cud flag', dataIndex : '_cud_flag_', hidden : true, sortable : false, width : 0, value : '' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'new', 'temp_save', 'save', 'print']
	} ]
});
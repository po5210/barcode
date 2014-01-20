Ext.define('Bar.view.invoice.InvoiceList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'bar_invoice_list',
		
	store : 'Bar.store.Invoice',
	
	useDetailBtn : false,
	
	columns : [
		{ header : 'Seq.', dataIndex : 'seq', width : 45, sortOption : { sortSeq : 10, sortDirection : 'asc' } },
		{ header : T('label.product'), dataIndex : 'product', width : 125 },
		{ header : T('label.x_desc', {x : T('label.product')}), dataIndex : 'product_desc', flex : 1 },
		{ header : T('label.lot_size'), dataIndex : 'lot_size', width : 85 },
		{ header : T('label.unit_price'), dataIndex : 'unit_price', width : 95 },
		{ header : T('label.lot_qty'), dataIndex : 'lot_qty', width : 85 },
		{ header : T('label.qty'), dataIndex : 'qty', width : 85 },
		{ header : T('label.total_price'), dataIndex : 'total_price', width : 100 },
		{ header : T('label.part_no'), dataIndex : 'part_no', flex : 1 },
		{ header : 'cud flag', dataIndex : '_cud_flag_', hidden : true, sortable : false, width : 0, value : '' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'invoice', 'print', 'receive', 'reprint']
	} ]
});
Ext.define('Bar.view.invoice.InvoiceList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'bar_invoice_list',
		
	store :  Ext.create('Ext.data.Store', {
		fields : [
			{ name : 'bill_nb', type : 'string' },
			{ name : 'item_sq', type : 'integer' },
			{ name : 'item_cd', type : 'string'},
			{ name : 'item_nm', type : 'string'},
			{ name : 'lot_qt', type : 'integer'},
			{ name : 'bill_qt', type : 'integer' },
			{ name : 'lot_size', type : 'integer' },
			{ name : 'tr_cd', type : 'string' },
			{ name : 'lot_no', type : 'string' },
			{ name : 'serial_no', type : 'string' },
			{ name : 'unit_price', type : 'float' },
			{ name : 'price', type : 'float' },
			{ name : 'cust_part_no', type : 'string' },
			{ name : '_cud_flag_', type : 'string' }
		]
	}),
	
	useDetailBtn : false,
	
	columns : [
		{ dataIndex : 'item_sq', xtype : 'rownumberer', width : 30 },
		{ header : T('label.item'), dataIndex : 'item_cd', width : 125 },
		{ header : T('label.x_desc', {x : T('label.item')}), dataIndex : 'item_nm', flex : 1 },
		{ header : T('label.lot_size'), dataIndex : 'lot_size', xtype : 'numbercolumn', width : 80, align : 'right', format : T('format.number') },
		{ header : T('label.unit_price'), dataIndex : 'unit_price', xtype : 'numbercolumn', width : 100, align : 'right', format : T('format.number') },
		{ header : T('label.lot_qt'), dataIndex : 'lot_qt', xtype : 'numbercolumn', width : 80, align : 'right', format : T('format.number') },
		{ header : T('label.bill_qt'), dataIndex : 'bill_qt', xtype : 'numbercolumn', width : 80, align : 'right', format : T('format.number') },
		{ header : T('label.price'), dataIndex : 'price', xtype : 'numbercolumn', width : 105, align : 'right', format : T('format.number') },
		{ header : T('label.cust_part_no'), dataIndex : 'cust_part_no', flex : 1 },
		{ header : 'cud flag', dataIndex : '_cud_flag_', hidden : true, sortable : false, width : 0, value : '' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'invoice', 'print', 'receive', 'reprint']
	} ]
});
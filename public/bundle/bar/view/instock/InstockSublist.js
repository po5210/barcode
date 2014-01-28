Ext.define('Bar.view.instock.InstockSublist', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'bar_instock_sublist',
			
	store : Ext.create('Ext.data.Store', {
		fields : [
			{ name : 'bill_nb', type : 'string' },
			{ name : 'item_cd', type : 'string' },
			{ name : 'item_nm', type : 'string' },
			{ name : 'item_serial', type : 'string' },
			{ name : 'scan_qty', type : 'integer' },
			{ name : 'real_qty', type : 'integer' },
			{ name : 'barcode_str', type : 'string' },
			{ name : 'baseloc_cd', type : 'string' },
			{ name : 'loc_cd', type : 'string' },
			{ name : '_cud_flag_', type : 'string' }
		]
	}),
	
	useDetailBtn : false,
	
	columns : [
		{ header : T('label.serial'), dataIndex : 'item_serial', width : 85, sortOption : { sortSeq : 10, sortDirection : 'asc' } },
		{ header : T('label.warehouse'), dataIndex : 'baseloc_cd', width : 85 },
		{ header : T('label.location'), dataIndex : 'loc_cd', width : 85 },
		{ header : T('label.item'), dataIndex : 'item_cd', width : 125 },
		{ header : T('label.x_desc', {x : T('label.item')}), dataIndex : 'item_nm', flex : 1 },
		{ header : T('label.scan_qty'), dataIndex : 'scan_qty', width : 85 },
		{ header : T('label.real_qty'), dataIndex : 'real_qty', width : 85 },
		{ dataIndex : 'barcode_str', hidden : true },
		{ header : 'cud flag', dataIndex : '_cud_flag_', hidden : true, sortable : false, width : 0, value : '' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'new', 'save']
	} ]
});
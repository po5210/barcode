Ext.define('Bar.view.instock.InstockSublist', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'bar_instock_sublist',
			
	store : Ext.create('Ext.data.Store', {
		fields : [
			{ name : 'serial', type : 'string' },
			{ name : 'warehouse', type : 'string'},
			{ name : 'location', type : 'string'},
			{ name : 'product', type : 'auto' },
			{ name : 'product_desc', type : 'string' },
			{ name : 'product_type', type : 'string' },
			{ name : 'scan_qty', type : 'integer' },
			{ name : 'real_qty', type : 'integer' },
			{ name : '_cud_flag_', type : 'string' }
		]
	}),
	
	useDetailBtn : false,
	
	columns : [
		{ header : T('label.serial'), dataIndex : 'serial', width : 85, sortOption : { sortSeq : 10, sortDirection : 'asc' } },
		{ header : T('label.warehouse'), dataIndex : 'warehouse', width : 85 },
		{ header : T('label.location'), dataIndex : 'location', width : 85 },
		{ header : T('label.product'), dataIndex : 'product', width : 125 },
		{ header : T('label.x_desc', {x : T('label.product')}), dataIndex : 'product_desc', flex : 1 },
		{ header : T('label.x_type', {x : T('label.product')}), dataIndex : 'product_type', width : 90 },
		{ header : T('label.scan_qty'), dataIndex : 'scan_qty', width : 85 },
		{ header : T('label.real_qty'), dataIndex : 'real_qty', width : 85 },
		{ header : 'cud flag', dataIndex : '_cud_flag_', hidden : true, sortable : false, width : 0, value : '' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'label_print']
	} ]
});
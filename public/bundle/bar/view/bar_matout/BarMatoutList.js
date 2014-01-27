Ext.define('Bar.view.bar_matout.BarMatoutList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'bar_bar_matout_list',
		
	store : 'Bar.store.BarMatout',
	
	useDetailBtn : false,
	
	columns : [
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ header : T('label.domain_id'), dataIndex : 'domain_id', sortable : false,  hidden : true },
		{ header : T('label.name'), dataIndex : 'name' , sortOption : { sortSeq : 30, sortDirection : 'asc' } },
		{ header : T('label.who_dt'), dataIndex : 'who_dt' , sortOption : { sortSeq : 10, sortDirection : 'asc' } },
		{ header : T('label.who_sq'), dataIndex : 'who_sq', xtype : 'numbercolumn', format : T('format.number'), align : 'right' , sortOption : { sortSeq : 20, sortDirection : 'asc' } },
		{ header : T('label.who_fg'), dataIndex : 'who_fg' },
		{ header : T('label.lot_qty'), dataIndex : 'lot_qty', xtype : 'numbercolumn', format : T('format.number'), align : 'right' },
		{ header : T('label.lot_rqty'), dataIndex : 'lot_rqty', xtype : 'numbercolumn', format : T('format.number'), align : 'right' },
		{ header : T('label.item_cd'), dataIndex : 'item_cd' , sortOption : { sortSeq : 40, sortDirection : 'asc' } },
		{ header : T('title.bar_locgrp'), dataIndex : 'bar_locgrp', xtype : 'entitycolumn' },
		{ header : T('title.bar_locmap'), dataIndex : 'bar_locmap', xtype : 'entitycolumn' },
		{ header : T('label.outbaseloc_cd'), dataIndex : 'outbaseloc_cd' },
		{ header : T('label.outloc_cd'), dataIndex : 'outloc_cd' },
		{ header : T('label.whi_dt'), dataIndex : 'whi_dt' },
		{ header : T('label.whi_sq'), dataIndex : 'whi_sq', xtype : 'numbercolumn', format : T('format.number'), align : 'right' },
		{ header : T('label.lot_no'), dataIndex : 'lot_no' },
		{ header : T('label.ser_no'), dataIndex : 'ser_no' },
		{ header : 'cud flag', dataIndex : '_cud_flag_', hidden : true, sortable : false, width : 0, value : '' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'add', 'update', 'delete']
	} ]
});
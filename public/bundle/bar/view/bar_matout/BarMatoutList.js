Ext.define('Bar.view.bar_matout.BarMatoutList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'bar_bar_matout_list',
		
	store :  'Bar.store.BarMatout',
	
	useDetailBtn : false,
	
	columns : [
		{ 
			header : T('label.item_cd'), 
			dataIndex : 'item_cd', 
			width : 40,
			sortOption : { sortSeq : 10, sortDirection : 'asc' }	
		},
		{ header : T('label.item_nm'), dataIndex : 'item_nm', sortOption : { sortSeq : 40, sortDirection : 'asc' } },
		{ header : T('label.lot_qty'), dataIndex : 'lot_qty', xtype : 'numbercolumn', format : T('format.number'), align : 'right' },
		{ header : T('label.lot_rqty'), dataIndex : 'lot_rqty', xtype : 'numbercolumn', format : T('format.number'), align : 'right' },
		{ header : T('label.lot_no'), dataIndex : 'lot_no' },
		{ header : T('label.ser_no'), dataIndex : 'ser_no' },
		{ 
			header : T('label.baseloc_cd'), 
			dataIndex : 'baseloc_cd', 
			width : 100,
			editor : {xtype : 'entityfield', storeClass : 'Bar.store.BarLocgrp'}			
		},
		{ 
			header : T('label.loc_cd'), 
			dataIndex : 'loc_cd', 
			width : 100,
			editor : { xtype : 'entityfield', storeClass : 'Bar.store.BarLocmap'  }			
		},
		{ 
			header : T('label.outbaseloc_cd'), 
			dataIndex : 'outbaseloc_cd', 
			width : 100,
			editor : {xtype : 'entityfield', storeClass : 'Bar.store.BarLocgrp'}			
		},
		{ 
			header : T('label.outloc_cd'), 
			dataIndex : 'outloc_cd', 
			width : 100,
			editor : { xtype : 'entityfield', storeClass : 'Bar.store.BarLocmap'  }			
		},
		{ header : T('label.whi_sq'), dataIndex : 'whi_sq', hidden : true, xtype : 'numbercolumn', format : T('format.number'), align : 'right' },
		{ header : 'cud flag', dataIndex : '_cud_flag_', hidden : true, sortable : false, width : 0, value : '' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'new', 'save', 'delete', 'print', 'export' ]
	} ]
});
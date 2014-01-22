Ext.define('Bar.view.report.GiByMatList', {
	
	extend : 'Base.abstract.entity.ReportGridView',
	
	xtype : 'bar_gi_by_mat_list',
	
	useCheckBox : false,
		
	store : 'Bar.store.GiByMat',
	
	columns : [
		{ header : T('label.date'), dataIndex : 'whi_dt', align : 'center', width : 80 },
		{ header : T('label.part_no'), dataIndex : 'item_cd', width : 100 },
		{ header : T('label.description'), dataIndex : 'item_nm', width : 190 },
		{ header : T('label.type'), dataIndex : 'item_tp' },
		{ header : T('label.lot_qty'), dataIndex : 'lot_size', xtype : 'numbercolumn', format : T('format.number'), align : 'right', width : 60 },
		{ header : T('label.box_qty'), dataIndex : 'box_qty', xtype : 'numbercolumn', format : T('format.number'), align : 'right', width : 60 },
		{ header : T('label.out_qty'), dataIndex : 'lot_rqty', xtype : 'numbercolumn', format : T('format.number'), align : 'right', width : 65 },
		{ header : T('label.warehouse'), dataIndex : 'baseloc_cd', width : 220 },
		{ header : T('label.location'), dataIndex : 'loc_cd', width : 220 },
		{ header : 'To ' + T('label.warehouse'), dataIndex : 'outbaseloc_cd', width : 220 },
		{ header : 'To ' + T('label.location'), dataIndex : 'outloc_cd', width : 220 }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		//items: ['->', 'export']
		items : []
	} ]
});
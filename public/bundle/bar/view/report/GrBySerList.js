Ext.define('Bar.view.report.GrBySerList', {
	
	extend : 'Base.abstract.entity.ReportGridView',
	
	xtype : 'bar_gr_by_ser_list',
	
	useCheckBox : false,
		
	store : 'Bar.store.GrBySer',
	
	columns : [
		{ header : T('label.date'), dataIndex : 'wh_dt', align : 'center', width : 80 },
		{ header : T('label.supplier'), dataIndex : 'tr_cd', width : 250 },
		{ header : T('label.invoice_no'), dataIndex : 'invoice_no', width : 150},
		{ header : T('label.invoice_date'), dataIndex : 'invoice_date', width : 80 },
		{ header : T('label.po_no'), dataIndex : 'po_no', width : 150 },
		{ header : T('label.part_no'), dataIndex : 'item_cd', width : 100 },
		{ header : T('label.description'), dataIndex : 'item_nm', width : 180 },
		{ header : T('label.type'), dataIndex : 'item_tp' },
		{ header : T('label.lot_size'), dataIndex : 'lot_size', xtype : 'numbercolumn', format : T('format.number'), align : 'right', width : 60 },
		{ header : T('label.object'), dataIndex : 'object', width : 60, align:'center' },
		{ header : T('label.lot_no'), dataIndex : 'lot_no', width : 70, align:'center' },
		{ header : T('label.internal_no'), dataIndex : 'internal', width : 140, align:'center' },
		{ header : T('label.serial_no'), dataIndex : 'serial', width : 60 },
		{ header : T('label.lot_rqty'), dataIndex : 'lot_rqty', xtype : 'numbercolumn', format : T('format.number'), width : 60, align : 'right' },
		{ header : T('label.baseloc_cd'), dataIndex : 'baseloc_cd', width : 180 },
		{ header : T('label.loc_cd'), dataIndex : 'loc_cd', width : 180 },
		{ header : T('label.invoice_state'), dataIndex : 'invoice_state', width : 80, xtype : 'codecolumn', tpl : '{description}', commonCode : 'INV_STATE', align:'center'  },
		{ header : T('label.creator'), dataIndex : 'reg_id', width : 100 , xtype : 'entitycolumn'  },
		{ header : T('label.created_at'), dataIndex : 'reg_dtm', width : 130 }
/*		
		{ header : T('label.warehouse'), dataIndex : 'loc_cd', width : 220 },
		{ header : T('label.location'), dataIndex : 'loc_nm', width : 220 },
		{ header : 'From ' + T('label.warehouse'), dataIndex : 'outloc_cd', width : 220 },
		{ header : 'From ' + T('label.location'), dataIndex : 'outloc_nm', width : 220 }
*/		
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		//items: ['->', 'export']
		items : []
	} ]
});
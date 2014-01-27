Ext.define('Bar.view.report.GrByMatList', {
	
	extend : 'Base.abstract.entity.ReportGridView',
	
	xtype : 'bar_gr_by_mat_list',
	
	useCheckBox : false,
		
	store : 'Bar.store.GrByMat',
	
	columns : [
		{ header : T('label.date'), dataIndex : 'bill_dt', align : 'center', width : 80, align:'center' },
		{ header : T('label.bill_nb'), dataIndex : 'bill_nb', width : 150, align:'center' },
		{ header : T('label.supplier'), dataIndex : 'tr_cd_name', width : 250 },
		{ header : T('label.invoice_no'), dataIndex : 'invoice_no', width : 150},
		{ header : T('label.invoice_date'), dataIndex : 'invoice_date', width : 80 },
		{ header : T('label.po_no'), dataIndex : 'po_no', width : 150 },
		{ header : T('label.part_no'), dataIndex : 'item_cd', width : 100 },
		{ header : T('label.description'), dataIndex : 'item_nm', width : 180 },
		{ header : T('label.type'), dataIndex : 'item_tp' },
		{ header : T('label.baseloc_cd'), dataIndex : 'baseloc_cd', width : 180 },
		{ header : T('label.loc_cd'), dataIndex : 'loc_cd', width : 180 },
		{ header : T('label.lot_size'), dataIndex : 'lot_size', xtype : 'numbercolumn', format : T('format.number'), align : 'right', width : 60 },
		{ header : T('label.box_qty'), dataIndex : 'box_qty', xtype : 'numbercolumn', format : T('format.number'), align : 'right', width : 60 },
		{ header : T('label.delivery_qty'), dataIndex : 'in_qty', xtype : 'numbercolumn', format : T('format.number'), align : 'right', width : 80 },
		{ header : T('label.invoice_state'), dataIndex : 'invoice_state', width : 80, xtype : 'codecolumn', tpl : '{description}', commonCode : 'INV_STATE', align:'center'  },
		{ header : T('label.creator'), dataIndex : 'reg_id', width : 100 , xtype : 'entitycolumn'  },
		{ header : T('label.created_at'), dataIndex : 'reg_dtm', width : 130 }
/*		
		{ header : T('label.warehouse'), dataIndex : 'baseloc_cd', width : 220 },
		{ header : T('label.location'), dataIndex : 'loc_cd', width : 220 },
		{ header : 'From ' + T('label.warehouse'), dataIndex : 'outbaseloc_cd', width : 220 },
		{ header : 'From ' + T('label.location'), dataIndex : 'outloc_cd', width : 220 },
*/			
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		//items: ['->', 'export']
		items : []
	} ]
});
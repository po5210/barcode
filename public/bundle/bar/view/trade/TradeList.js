Ext.define('Bar.view.trade.TradeList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'bar_trade_list',
		
	store : 'Bar.store.Trade',
	
	useDetailBtn : false,
	
	columns : [
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ header : T('label.domain_id'), dataIndex : 'domain_id', sortable : false,  hidden : true },
		{ header : T('label.tr_cd'), dataIndex : 'tr_cd' , sortOption : { sortSeq : 10, sortDirection : 'asc' } },
		{ header : T('label.tr_nm'), dataIndex : 'tr_nm' },
		{ header : T('label.tr_fg'), dataIndex : 'tr_fg' },
		{ header : T('label.reg_nb'), dataIndex : 'reg_nb' },
		{ header : T('label.ppl_nb'), dataIndex : 'ppl_nb' },
		{ header : T('label.ceo_nm'), dataIndex : 'ceo_nm' },
		{ header : T('label.business'), dataIndex : 'business' },
		{ header : T('label.jongmok'), dataIndex : 'jongmok' },
		{ header : T('label.zip'), dataIndex : 'zip' },
		{ header : T('label.div_addr1'), dataIndex : 'div_addr1' },
		{ header : T('label.addr2'), dataIndex : 'addr2' },
		{ header : T('label.ddd'), dataIndex : 'ddd' },
		{ header : T('label.tel'), dataIndex : 'tel' },
		{ header : T('label.fax'), dataIndex : 'fax' },
		{ header : T('label.tr_nmk'), dataIndex : 'tr_nmk' },
		{ header : T('label.use_yn'), dataIndex : 'use_yn', xtype : 'codecolumn', tpl : '{description}', commonCode : 'USE_YN' },
		{ header : T('label.updater'), dataIndex : 'updater', xtype : 'entitycolumn' },
		{ header : T('label.updated_at'), dataIndex : 'updated_at', xtype : 'datecolumn', format : T('format.datetime'), width : 120 },
		{ header : 'cud flag', dataIndex : '_cud_flag_', hidden : true, sortable : false, width : 0, value : '' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'loc_list', 'import', 'export', 'add', 'update', 'delete']
	} ]
});
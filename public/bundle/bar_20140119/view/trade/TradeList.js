Ext.define('Bar.view.trade.TradeList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'bar_trade_list',
		
	store : 'Bar.store.Trade',
	
	useDetailBtn : false,
	
	columns : [
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ header : T('label.code'), dataIndex : 'tr_cd' , sortOption : { sortSeq : 10, sortDirection : 'asc' } },
		{ header : T('label.name'), dataIndex : 'tr_nm' },
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
		{ header : T('label.attr_nmk'), dataIndex : 'attr_nmk' },
		{ header : T('label.ceo_nmk'), dataIndex : 'ceo_nmk' },
		{ header : T('label.use_yn'), dataIndex : 'use_yn', xtype : 'codecolumn', tpl : '{description}', commonCode : 'YES_NO' },
		{ header : 'cud flag', dataIndex : '_cud_flag_', hidden : true, sortable : false, width : 0, value : '' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'add', 'update', 'delete']
	} ]
});
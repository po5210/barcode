Ext.define('Bar.view.trade.TradeSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'bar_trade_search',
		
	items : [
		{ fieldLabel : T('label.tr_cd'), name : 'tr_cd' },
		{ fieldLabel : T('label.tr_nm'), name : 'tr_nm' },
		{ fieldLabel : T('label.tr_fg'), name : 'tr_fg' },
		{ fieldLabel : T('label.reg_nb'), name : 'reg_nb' },
		{ fieldLabel : T('label.use_yn'), name : 'use_yn', xtype : 'codecombo', commonCode : 'YES_NO', displayField : 'description' }
	]
	
});
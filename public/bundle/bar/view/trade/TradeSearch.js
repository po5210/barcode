Ext.define('Bar.view.trade.TradeSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'bar_trade_search',
		
	items : [
		{ fieldLabel : T('label.code'), name : 'name-like' },
		{ fieldLabel : T('label.name'), name : 'description-like' },
		{ fieldLabel : T('label.tr_fg'), name : 'tr_fg-like' },
		{ fieldLabel : T('label.reg_nb'), name : 'reg_nb-like' },
		{ fieldLabel : T('label.use_yn'), name : 'use_yn-eq', xtype : 'codecombo', commonCode : 'USE_YN', displayField : 'description' }
	]
	
});
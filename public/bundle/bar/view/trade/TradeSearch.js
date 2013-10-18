Ext.define('Bar.view.trade.TradeSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'bar_trade_search',
		
	items : [
		{ fieldLabel : T('label.tr_cd'), name : 'tr_cd-like' },
		{ fieldLabel : T('label.tr_nm'), name : 'tr_nm-like' },
		{ fieldLabel : T('label.tr_fg'), name : 'tr_fg-like' },
		{ fieldLabel : T('label.reg_nb'), name : 'reg_nb-like' },
	]
	
});
Ext.define('Bar.view.trade.Trade', {
	
	extend: 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'Bar.view.trade.TradeSearch',
		'Bar.view.trade.TradeList'
	],
	
	xtype : 'bar_trade',
	
	title : T('menu.Trade'),
	
	searchView : 'bar_trade_search',
	
	gridView : 'bar_trade_list'
	
});
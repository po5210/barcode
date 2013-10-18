Ext.define('Bar.view.trade.TradeDetail', {
	
	extend : 'Base.abstract.Popup',
	
 	requires : [ 
		'Bar.view.trade.TradeForm'
	],
	
	xtype : 'bar_trade_detail',

    height : 700,
	
	title : T('menu.Trade'),
		
	items : [ {
		xtype : 'bar_trade_form'
	} ],
	
	setRecord : function(record) {
		this.record = record;
		this.down('form').loadRecord(this.record);
	},
	
	getRecord : function() {
		return this.record;
	}
});
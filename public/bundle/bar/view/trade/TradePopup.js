Ext.define('Bar.view.trade.TradePopup', {
	
	extend : 'Base.abstract.Popup',
	
 	requires : [ 
		'Bar.store.Baseloc'
	],
	
	xtype : 'bar_trade_popup',

  height : 500,
	
	title : T('menu.Baseloc'),
		
	items : [ {
		xtype : 'grid',
		store : Ext.create('Ext.data.Store', {
			fields: [
         {name: 'id', type: 'string'},
         {name: 'code',  type: 'string'},
         {name: 'name',       type: 'string'}
     ],
     proxy: {
         type: 'memory'
     }
		}),//'Bar.store.Baseloc',
		columns : [{
			header : T('label.id'), dataIndex : 'id', hidden : true
		}, {
			header : T('label.baseloc_cd'), dataIndex : 'code'
		}, {
			header : T('label.baseloc_nm'), dataIndex : 'name'
		}]
	} ]
});
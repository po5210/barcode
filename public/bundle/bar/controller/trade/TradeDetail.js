/**
 * TradeDetail controller
 */
Ext.define('Bar.controller.trade.TradeDetail', {
	
	extend: 'Base.abstract.entity.PopupFormController',
	
	requires : [ 
		'Bar.model.Trade', 
		'Bar.store.Trade', 
		'Bar.view.trade.TradeDetail'
	],
	
	models : ['Bar.model.Trade'],
			
	stores: ['Bar.store.Trade'],
	
	views : ['Bar.view.trade.TradeDetail'],
	
	refs: [ { ref : 'TradeDetail', selector : 'bar_trade_detail' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'bar_trade_detail' : {
				paramschange : this.onParamsChange,
				after_detail_loaded : this.afterDetailLoaded
			},
			' bar_trade_form' : {
				click_close : this.onClickClose,
				click_save :  this.onFormSave,
				click_delete : this.onFormDelete,
				after_form_saved : this.afterFormSaved,
				after_form_deleted : this.afterFormDeleted,
				validitychange: this.onFormValidityChange
			}
		});
	},
	
	/****************************************************************
	 ** 					Override 구현 						   **
	 ****************************************************************/
	
	/****************************************************************
	 ** 					abstract method, 필수 구현 				   **
	 ****************************************************************/
	/**
	 * main view를 리턴 
	 */
	getMainView : function() {
		return this.getTradeDetail();
	}
});
/**
 * Trade controller
 */
Ext.define('Bar.controller.trade.Trade', {
	
	extend: 'Base.abstract.entity.ListMainController',
	
	requires : [ 
		'Bar.model.Trade', 
		'Bar.store.Trade', 
		'Bar.view.trade.Trade' 
	],
	
	models : ['Bar.model.Trade'],
			
	stores: ['Bar.store.Trade'],
	
	views : ['Bar.view.trade.Trade'],
	
	refs: [ { ref : 'Trade', selector : 'bar_trade' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'bar_trade' : {
				paramschange : this.onParamsChange,
				after_import : this.onImportSuccess
			},
			'bar_trade_list' : {
				click_add : this.onPopupNew,
				click_save : this.onGridSave,
				click_delete : this.onGridDelete,
				click_import : this.onImport,
				click_export : this.onExport,
				after_grid_updated : this.afterGridUpdated,
				click_update : this.onInquiryDetail
			},
			'bar_trade_search' : {
				click_search : this.onSearchClick,
				click_reset : this.onResetClick
			},
			'bar_trade_list #go_detail' : {
				click : this.onShowDetail
			}
		});
	},

	/****************************************************************
	 ** 			여기는 customizing area 						   **
	 ****************************************************************/
	/**
	 * after import success
	 */
	onImportSuccess : function(response) {
		var gridView = this.getGridView();
		gridView.store.load();
	},
			
	/****************************************************************
	 ** 			여기서 부터는 abstract method, 필수 구현 				   **
	 ****************************************************************/
	onPopupNew : function() {
		HF.popup(this.getDetailViewName(), {}, {});
	},

	/**
	 * detail view type(popup | view | none)을 리턴
	 */	
	getDetailViewType : function() {
		return 'popup';
	},
	
	/**
	 * main view를 리턴 
	 */
	getMainView : function() {
		return this.getTrade();
	}
});
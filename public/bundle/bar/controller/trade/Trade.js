/**
 * Trade controller
 */
Ext.define('Bar.controller.trade.Trade', {
	
	extend: 'Base.abstract.entity.ListMainController',
	
	requires : [ 
		'Bar.model.Trade', 
		'Bar.store.Trade', 
		'Bar.view.trade.Trade',
		'Bar.store.Baseloc',
		'Bar.view.trade.TradePopup' 
	],
	
	models : ['Bar.model.Trade'],
			
	stores: ['Bar.store.Trade', 'Bar.store.Baseloc'],
	
	views : ['Bar.view.trade.Trade', 'Bar.view.trade.TradePopup'],
	
	refs: [ 
		{ ref : 'Trade', selector : 'bar_trade' },
		{ ref : 'TradePopup', selector : 'bar_trade_popup' }
	],
	
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
				click_update : this.onInquiryDetail,
				click_loc_list : this.onLocList
			},
			'bar_trade_search' : {
				click_search : this.onSearchClick,
				click_reset : this.onResetClick
			},
			'bar_trade_list #go_detail' : {
				click : this.onShowDetail
			},
			'bar_trade_popup' : {
				paramschange : this.onPopupParamsChange
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
	
	onLocList : function() {
		HF.popup('Bar.view.trade.TradePopup', {}, {});
	},
	
	onPopupParamsChange : function(popup, params) {
			Ext.Ajax.request({
				url: '/domains/' + login.current_domain_id + '/baselocs.json',
				method : 'GET',
				success: function(response, opts) {
					alert(response.responseText);
					var baseloc = Ext.JSON.decode(response.responseText);
					var records = [];
					Ext.Array.each(baseloc.items, function(item) {
						var rec = {id : item.id, code : item.baseloc_cd, name : item.baseloc_nm };
						records.push(rec); 
					});
					popup.child('grid').store.loadRawData(records);
					//console.log(productList);
					// use - store
					//popup.child('grid').store.load();
				},
				failure: function(response) {
					Ext.Msg.alert('Failure', 'Failure');
				}
			});
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
/**
 * BarLocgrp controller
 */
Ext.define('Bar.controller.bar_locgrp.BarLocgrp', {
	
	extend: 'Base.abstract.entity.ListMainController',
	
	requires : [ 
		'Bar.model.BarLocgrp', 
		'Bar.store.BarLocgrp', 
		'Bar.view.bar_locgrp.BarLocgrp' 
	],
	
	models : ['Bar.model.BarLocgrp'],
			
	stores: ['Bar.store.BarLocgrp'],
	
	views : ['Bar.view.bar_locgrp.BarLocgrp'],
	
	refs: [ { ref : 'BarLocgrp', selector : 'bar_bar_locgrp' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'bar_bar_locgrp' : {
				paramschange : this.onParamsChange,
				after_import : this.onImportSuccess
			},
			'bar_bar_locgrp_list' : {
				click_add : this.onPopupNew,
				click_save : this.onGridSave,
				click_delete : this.onGridDelete,
				click_import : this.onImport,
				click_export : this.onExport,
				after_grid_updated : this.afterGridUpdated,
				click_update : this.onInquiryDetail
			},
			'bar_bar_locgrp_search' : {
				click_search : this.onSearchClick,
				click_reset : this.onResetClick
			},
			'bar_bar_locgrp_list #go_detail' : {
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
		return this.getBarLocgrp();
	}
});
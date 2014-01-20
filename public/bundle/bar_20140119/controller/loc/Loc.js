/**
 * Loc controller
 */
Ext.define('Bar.controller.loc.Loc', {
	
	extend: 'Base.abstract.entity.ListMainController',
	
	requires : [ 
		'Bar.model.Loc', 
		'Bar.store.Loc', 
		'Bar.view.loc.Loc' 
	],
	
	models : ['Bar.model.Loc'],
			
	stores: ['Bar.store.Loc'],
	
	views : ['Bar.view.loc.Loc'],
	
	refs: [ { ref : 'Loc', selector : 'bar_loc' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'bar_loc' : {
				paramschange : this.onParamsChange,
				after_import : this.onImportSuccess
			},
			'bar_loc_list' : {
				click_add : this.onPopupNew,
				click_save : this.onGridSave,
				click_delete : this.onGridDelete,
				click_import : this.onImport,
				click_export : this.onExport,
				after_grid_updated : this.afterGridUpdated,
				click_update : this.onInquiryDetail
			},
			'bar_loc_search' : {
				click_search : this.onSearchClick,
				click_reset : this.onResetClick
			},
			'bar_loc_list #go_detail' : {
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
		return this.getLoc();
	}
});
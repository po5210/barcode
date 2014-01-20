/**
 * Supplier controller
 */
Ext.define('Bar.controller.supplier.Supplier', {
	
	extend: 'Base.abstract.entity.ListMainController',
	
	requires : [ 
		'Bar.model.Supplier', 
		'Bar.store.Supplier', 
		'Bar.view.supplier.Supplier' 
	],
	
	models : ['Bar.model.Supplier'],
			
	stores: ['Bar.store.Supplier'],
	
	views : ['Bar.view.supplier.Supplier'],
	
	refs: [ { ref : 'Supplier', selector : 'bar_supplier' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'bar_supplier' : {
				paramschange : this.onParamsChange,
				after_import : this.onImportSuccess
			},
			'bar_supplier_list' : {
				click_add : this.onPopupNew,
				click_save : this.onGridSave,
				click_delete : this.onGridDelete,
				click_import : this.onImport,
				click_export : this.onExport,
				after_grid_updated : this.afterGridUpdated,
				click_update : this.onInquiryDetail
			},
			'bar_supplier_search' : {
				click_search : this.onSearchClick,
				click_reset : this.onResetClick
			},
			'bar_supplier_list #go_detail' : {
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
		return this.getSupplier();
	}
});
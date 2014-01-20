/**
 * SupplierDetail controller
 */
Ext.define('Bar.controller.supplier.SupplierDetail', {
	
	extend: 'Base.abstract.entity.PopupFormController',
	
	requires : [ 
		'Bar.model.Supplier', 
		'Bar.store.Supplier', 
		'Bar.view.supplier.SupplierDetail'
	],
	
	models : ['Bar.model.Supplier'],
			
	stores: ['Bar.store.Supplier'],
	
	views : ['Bar.view.supplier.SupplierDetail'],
	
	refs: [ { ref : 'SupplierDetail', selector : 'bar_supplier_detail' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'bar_supplier_detail' : {
				paramschange : this.onParamsChange,
				after_detail_loaded : this.afterDetailLoaded
			},
			' bar_supplier_form' : {
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
		return this.getSupplierDetail();
	}
});
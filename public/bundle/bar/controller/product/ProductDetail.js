/**
 * ProductDetail controller
 */
Ext.define('Bar.controller.product.ProductDetail', {
	
	extend: 'Base.abstract.entity.PopupFormController',
	
	requires : [ 
		'Bar.model.Product', 
		'Bar.store.Product', 
		'Bar.view.product.ProductDetail'
	],
	
	models : ['Bar.model.Product'],
			
	stores: ['Bar.store.Product'],
	
	views : ['Bar.view.product.ProductDetail'],
	
	refs: [ { ref : 'ProductDetail', selector : 'bar_product_detail' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'bar_product_detail' : {
				paramschange : this.onParamsChange,
				after_detail_loaded : this.afterDetailLoaded
			},
			' bar_product_form' : {
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
		return this.getProductDetail();
	}
});
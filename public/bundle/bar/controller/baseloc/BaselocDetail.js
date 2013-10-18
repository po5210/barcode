/**
 * BaselocDetail controller
 */
Ext.define('Bar.controller.baseloc.BaselocDetail', {
	
	extend: 'Base.abstract.entity.PopupFormController',
	
	requires : [ 
		'Bar.model.Baseloc', 
		'Bar.store.Baseloc', 
		'Bar.view.baseloc.BaselocDetail'
	],
	
	models : ['Bar.model.Baseloc'],
			
	stores: ['Bar.store.Baseloc'],
	
	views : ['Bar.view.baseloc.BaselocDetail'],
	
	refs: [ { ref : 'BaselocDetail', selector : 'bar_baseloc_detail' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'bar_baseloc_detail' : {
				paramschange : this.onParamsChange,
				after_detail_loaded : this.afterDetailLoaded
			},
			' bar_baseloc_form' : {
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
		return this.getBaselocDetail();
	}
});
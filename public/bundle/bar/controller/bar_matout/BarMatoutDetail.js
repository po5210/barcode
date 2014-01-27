/**
 * BarMatoutDetail controller
 */
Ext.define('Bar.controller.bar_matout.BarMatoutDetail', {
	
	extend: 'Base.abstract.entity.PopupFormController',
	
	requires : [ 
		'Bar.model.BarMatout', 
		'Bar.store.BarMatout', 
		'Bar.view.bar_matout.BarMatoutDetail'
	],
	
	models : ['Bar.model.BarMatout'],
			
	stores: ['Bar.store.BarMatout'],
	
	views : ['Bar.view.bar_matout.BarMatoutDetail'],
	
	refs: [ { ref : 'BarMatoutDetail', selector : 'bar_bar_matout_detail' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'bar_bar_matout_detail' : {
				paramschange : this.onParamsChange,
				after_detail_loaded : this.afterDetailLoaded
			},
			' bar_bar_matout_form' : {
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
		return this.getBarMatoutDetail();
	}
});
/**
 * LocDetail controller
 */
Ext.define('Bar.controller.loc.LocDetail', {
	
	extend: 'Base.abstract.entity.PopupFormController',
	
	requires : [ 
		'Bar.model.Loc', 
		'Bar.store.Loc', 
		'Bar.view.loc.LocDetail'
	],
	
	models : ['Bar.model.Loc'],
			
	stores: ['Bar.store.Loc'],
	
	views : ['Bar.view.loc.LocDetail'],
	
	refs: [ { ref : 'LocDetail', selector : 'bar_loc_detail' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'bar_loc_detail' : {
				paramschange : this.onParamsChange,
				after_detail_loaded : this.afterDetailLoaded
			},
			' bar_loc_form' : {
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
		return this.getLocDetail();
	}
});
/**
 * BarLocmapDetail controller
 */
Ext.define('Bar.controller.bar_locmap.BarLocmapDetail', {
	
	extend: 'Base.abstract.entity.PopupFormController',
	
	requires : [ 
		'Bar.model.BarLocmap', 
		'Bar.store.BarLocmap', 
		'Bar.view.bar_locmap.BarLocmapDetail'
	],
	
	models : ['Bar.model.BarLocmap'],
			
	stores: ['Bar.store.BarLocmap'],
	
	views : ['Bar.view.bar_locmap.BarLocmapDetail'],
	
	refs: [ { ref : 'BarLocmapDetail', selector : 'bar_bar_locmap_detail' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'bar_bar_locmap_detail' : {
				paramschange : this.onParamsChange,
				after_detail_loaded : this.afterDetailLoaded
			},
			' bar_bar_locmap_form' : {
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
		return this.getBarLocmapDetail();
	}
});
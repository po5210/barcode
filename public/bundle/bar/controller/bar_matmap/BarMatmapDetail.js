/**
 * BarMatmapDetail controller
 */
Ext.define('Bar.controller.bar_matmap.BarMatmapDetail', {
	
	extend: 'Base.abstract.entity.PopupFormController',
	
	requires : [ 
		'Bar.model.BarMatmap', 
		'Bar.store.BarMatmap', 
		'Bar.view.bar_matmap.BarMatmapDetail'
	],
	
	models : ['Bar.model.BarMatmap'],
			
	stores: ['Bar.store.BarMatmap'],
	
	views : ['Bar.view.bar_matmap.BarMatmapDetail'],
	
	refs: [ { ref : 'BarMatmapDetail', selector : 'bar_bar_matmap_detail' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'bar_bar_matmap_detail' : {
				paramschange : this.onParamsChange,
				after_detail_loaded : this.afterDetailLoaded
			},
			' bar_bar_matmap_form' : {
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
		return this.getBarMatmapDetail();
	}
});
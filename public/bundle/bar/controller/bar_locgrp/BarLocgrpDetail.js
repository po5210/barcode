/**
 * BarLocgrpDetail controller
 */
Ext.define('Bar.controller.bar_locgrp.BarLocgrpDetail', {
	
	extend: 'Base.abstract.entity.PopupFormController',
	
	requires : [ 
		'Bar.model.BarLocgrp', 
		'Bar.store.BarLocgrp', 
		'Bar.view.bar_locgrp.BarLocgrpDetail'
	],
	
	models : ['Bar.model.BarLocgrp'],
			
	stores: ['Bar.store.BarLocgrp'],
	
	views : ['Bar.view.bar_locgrp.BarLocgrpDetail'],
	
	refs: [ { ref : 'BarLocgrpDetail', selector : 'bar_bar_locgrp_detail' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'bar_bar_locgrp_detail' : {
				paramschange : this.onParamsChange,
				after_detail_loaded : this.afterDetailLoaded
			},
			' bar_bar_locgrp_form' : {
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
		return this.getBarLocgrpDetail();
	}
});
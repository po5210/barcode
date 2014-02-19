/**
 * PartGroupDetail controller
 */
Ext.define('Bar.controller.part_group.PartGroupDetail', {
	
	extend: 'Base.abstract.entity.PopupFormController',
	
	requires : [ 
		'Bar.model.PartGroup', 
		'Bar.store.PartGroup', 
		'Bar.view.part_group.PartGroupDetail'
	],
	
	models : ['Bar.model.PartGroup'],
			
	stores: ['Bar.store.PartGroup'],
	
	views : ['Bar.view.part_group.PartGroupDetail'],
	
	refs: [ { ref : 'PartGroupDetail', selector : 'bar_part_group_detail' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'bar_part_group_detail' : {
				paramschange : this.onParamsChange,
				after_detail_loaded : this.afterDetailLoaded
			},
			' bar_part_group_form' : {
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
		/**
	 * 추가적으로 필요한 validation을 수행 
	 */
	validateLogic : function(form) {
		var formValues = form.getValues();
		
		var code = formValues.name;
		var name = formValues.description;
		
		formValues.name = code.toUpperCase();
		formValues.description = name.toUpperCase();
		form.setValues(formValues);
		return true;
	},
	/****************************************************************
	 ** 					abstract method, 필수 구현 				   **
	 ****************************************************************/
	/**
	 * main view를 리턴 
	 */
	getMainView : function() {
		return this.getPartGroupDetail();
	}
});
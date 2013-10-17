/**
 * <%= class_name %>Detail controller
 */
Ext.define('<%= @bundle %>.controller.<%= singular_name %>.<%= class_name %>Detail', {
	
	extend: 'Base.abstract.entity.PopupFormController',
	
	requires : [ 
		'<%= @bundle %>.model.<%= class_name %>', 
		'<%= @bundle %>.store.<%= class_name %>', 
		'<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>Detail'
	],
	
	models : ['<%= @bundle %>.model.<%= class_name %>'],
			
	stores: ['<%= @bundle %>.store.<%= class_name %>'],
	
	views : ['<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>Detail'],
	
	refs: [ { ref : '<%= class_name %>Detail', selector : '<%= @bundle.downcase %>_<%= singular_name %>_detail' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'<%= @bundle.downcase %>_<%= singular_name %>_detail' : {
				paramschange : this.onParamsChange,
				after_detail_loaded : this.afterDetailLoaded
			},
			' <%= @bundle.downcase %>_<%= singular_name %>_form' : {
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
		return this.get<%= class_name %>Detail();
	}
});
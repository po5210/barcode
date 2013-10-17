/**
 * TerminologyDetail controller
 */
Ext.define('Base.controller.terminology.TerminologyDetail', {
	
	extend : 'Base.abstract.entity.PopupFormController',
	
	requires : [ 
		'Base.model.Terminology', 
		'Base.store.Terminology', 
		'Base.view.terminology.TerminologyDetail'
	],
	
	models : ['Base.model.Terminology'],
			
	stores: ['Base.store.Terminology'],
	
	views : ['Base.view.terminology.TerminologyDetail'],
	
	refs: [ { ref : 'TerminologyDetail', selector : 'base_terminology_detail' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'base_terminology_detail' : {
				paramschange : this.onParamsChange,
				after_detail_loaded : this.afterDetailLoaded
			},
			' base_terminology_form' : {
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
	 * override
	 */
	beforeFormLoadRecord : function(record) {
		if(record.data.id) {
			this.getBasicFormView().down('textfield[name=name]').setReadOnly(true);
		}
	},
	
	/****************************************************************
	 ** 					abstract method, 필수 구현 				   **
	 ****************************************************************/
	/**
	 * main view를 리턴 
	 */
	getMainView : function() {
		return this.getTerminologyDetail();
	}
});
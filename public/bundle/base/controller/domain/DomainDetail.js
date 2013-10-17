/**
 * DomainDetail controller
 */
Ext.define('Base.controller.domain.DomainDetail', {
	
	extend: 'Base.abstract.entity.DetailMainController',
	
	requires : [ 
		'Base.model.Domain', 
		'Base.store.Domain', 
		'Base.view.domain.DomainDetail'
	],
	
	models : ['Base.model.Domain', 'Base.model.Shift'],
			
	stores: ['Base.store.Domain'],
	
	views : ['Base.view.domain.DomainDetail'],
	
	refs: [ { ref : 'DomainDetail', selector : 'base_domain_detail' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'base_domain_detail' : {
				paramschange : this.onParamsChange,
				after_detail_loaded : this.afterDetailLoaded
			},
			' base_domain_form' : {
				click_save :  this.onFormSave,
				after_form_saved : this.afterFormSaved
			},
			' base_domain_shift_form' : {
				click_save :  this.onShiftFormSave
			}
		});
	},
	
	/****************************************************************
	 ** 				여기는 customizing area 					   **
	 ****************************************************************/
	/**
	 * On Shift Form Save
	 */
	onShiftFormSave : function() {
		var shiftForm = this.getShiftForm().getForm();
		var values = shiftForm.getValues();
		var shift = Ext.create('Base.model.Shift', values);
		shift.save({
			success : function(shiftRecord, operation) {
				shiftForm.loadRecord(shiftRecord);
				HF.success(T('text.Success to Save'));
			}
		});
	},
	
	/**
	 * Get Shift Form
	 */
	getShiftForm : function() {
		return this.queryItem(null, 'base_domain_shift_form');
	},
		
	/****************************************************************
	 ** 					Override 구현 						   **
	 ****************************************************************/
	
	onParamsChange : function(view, params) {
		var domain_id = login.current_domain_id;
		Base.model.Domain.load(domain_id, {
			scope : this,
			success : function(record, operation) {
				view.fireEvent('after_detail_loaded', record, operation);
			}
		});
	},
	
	afterDetailLoaded : function(record, operation) {
		this.getBasicForm().loadRecord(record);
		Base.model.Shift.load(login.current_domain_id, {
			scope : this,
			success : function(shiftRecord, operation) {
				this.getShiftForm().getForm().loadRecord(shiftRecord);
			}
		});
	},

	/****************************************************************
	 ** 					abstract method, 필수 구현 				   **
	 ****************************************************************/
	/**
	 * main view를 리턴 
	 */
	getMainView : function() {
		return this.getDomainDetail();
	},
	
	getModelClass : function() {
		return Base.model.Domain;
	}
});
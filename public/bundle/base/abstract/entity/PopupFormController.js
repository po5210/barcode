/**
 * Popup Form controller
 */
Ext.define('Base.abstract.entity.PopupFormController', {
	
	extend: 'Base.abstract.entity.CoreController',
	
	/**
	 * initialize
	 */
	init : function() {
		this.parseClassName();
	},
	
	/**
	 * class name을 파싱하여 각종 name을 설정한다. 
	 */
	parseClassName : function() {
		var className = Ext.getClassName(this);
		var classNameArr = className.split('.');
		this.bundleName = classNameArr[0].toLowerCase();
		this.singleEntityName = classNameArr[2];
		this.basicFormName = this.bundleName + '_' + this.singleEntityName + '_form';
	},
	
	/**
	 * main store를 리턴 
	 */
	getMainStore : function() {	
		return this.getStore(this.stores[0]);
	},
	
	/**
	 * 기본 폼 뷰를 리턴 
	 */
	getBasicFormView : function() {
		return this.queryItem(null, this.basicFormName);
	},
	
	/**
	 * 기본 폼을 리턴 
	 */
	getBasicForm : function() {
		return this.getBasicFormView().getForm();
	},	

	/**
	 * entry point, 기본적으로 하나의 entity를 load한다. 
	 * entry point logic 자체를 바꾸기 위해서는 이를 override한다. 
	 */
	onParamsChange : function(view, params) {
		this.reload(view, params);
	},
	
	/**
	 * Form Load
	 */
	reload : function(view, params) {
		if(params && params.id) {
			var modelClass = Ext.ClassManager.get(this.models[0]);
			modelClass.load(params.id, {
				scope : this,
				success : function(record, operation) {
					view.fireEvent('after_detail_loaded', record, operation);
				}
			});
		} else {
			view.fireEvent('after_detail_loaded', {data : {id : ''}}, null);
		}
	},
	
	/**
	 * detail view loaded 후 콜백 
	 *
	 * @record
	 * @operation
	 */
	afterDetailLoaded : function(record, operation) {
		this.beforeFormLoadRecord(record);
		this.getBasicForm().loadRecord(record);
	},
	
	/**
	 * form이 record load하기 전 액션, 각 화면에서 override하여 구현 
	 *
	 * @record
	 * @operation
	 */
	beforeFormLoadRecord : function(record, operation) {	
	},
	
	/**
	 * new button click
	 *
	 * @formView
	 */	
	onFormNew : function(formView) {
		this.resetFormData(formView);
	},
	
	/**
	 * save button click
	 *
	 * @formView
	 */
	onFormSave : function(formView) {
		this.saveFormData(formView);
	},
	
	/**
	 * delete button click
	 *
	 * @formView
	 */
	onFormDelete : function(formView) {
		this.deleteFormData(formView);
	},
	
	/**
	 * after form saved callback
	 *
	 * @form
	 * @newRecord
	 */
	afterFormSaved : function(form, newRecord) {
		this.getBasicFormView().up(' window').close();
		this.getMainStore().reload();
	},
	
	/**
	 * after form deleted callback
	 *
	 * @form
	 * @record
	 * @operation
	 */
	afterFormDeleted : function(form, record, operation) {
		this.getBasicFormView().up(' window').close();
		this.getMainStore().reload();
	},
	
	/**
	 * 팝업 close
	 */
	onClickClose : function(view) {
		view.up().close();
	}
});
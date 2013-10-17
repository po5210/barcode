/**
 * User controller
 * View Type2 : grid - search - form
 */
Ext.define('Base.controller.user.User', {
	
	extend: 'Base.abstract.entity.ListMainController',
	
	requires : [ 
		'Base.model.User', 
		'Base.store.User', 
		'Base.view.user.User' 
	],
	
	models : ['Base.model.User'],
			
	stores: ['Base.store.User'],
	
	views : ['Base.view.user.User'],
	
	refs: [ { 
		ref : 'User', selector : 'base_user' 
	}, {
		ref : 'UserPopup', selector : 'base_user_popup' 
	} ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'base_user' : {
				paramschange : this.onParamsChange,
				after_import : this.onImportSuccess
			},
			'base_user_list' : {
				click_new : this.onNewClick,
				click_delete : this.onGridDelete,
				click_import : this.onImport,
				click_export : this.onExport,
				after_grid_updated : this.afterGridUpdated
			},
			'base_user_popup' : {
				after_form_saved : this.afterFormSaved,
				after_form_deleted : this.afterFormDeleted
			},
			'base_user_search' : {
				click_search : this.onSearchClick,
				click_reset : this.onResetClick
			},
			'base_user_list #go_detail' : {
				click : this.onShowDetail
			}
		});
	},

	/**
	 * multiple update url을 리턴 
	 */
	getMultipleUpdateUrl : function(grid) {
		return 'update_multiple_users.json';
	},
	
	/**
	 * show detail button을 클릭시  
	 *
	 * @gridView
	 */
	onShowDetail : function(gridView, td, rowIndex, colIndex, event, record, tr, grid) {
		HF.popup('Base.view.user.UserPopup', {id : record.get('id')}, {});
	},
	
	/*
	 * new button click 시 
	 */
	onNewClick : function() {
		HF.popup('Base.view.user.UserPopup', {}, {});
	},
	
	/**
	 * save button click
	 *
	 * @view
	 */
	onFormSave : function(view) {
		this.saveFormData(view);
	},
	
	/**
	 * delete button click
	 *
	 * @view
	 */
	onFormDelete : function(view) {
		this.deleteFormData(view);
	},
	
	/**
	 * after form saved callback
	 *
	 * @form
	 * @newRecord
	 */
	afterFormSaved : function(form, newRecord) {
		Ext.getStore(this.stores[0]).reload();
	},
	
	/**
	 * after form deleted callback
	 *
	 * @form
	 * @record
	 * @operation
	 */
	afterFormDeleted : function(form, record, operation) {
		Ext.getStore(this.stores[0]).reload();
	},
	
	/**
	 * after grid updated callback
	 *
	 * @grid
	 */
	afterGridUpdated : function(grid) {
		Ext.getStore(this.stores[0]).reload();
	},
	
	/**
	 * import override
	 */
	onImport : function() {
		HF.popup('Base.view.field.ImportPopup', null, {
			owner : this.getMainView(), 
			url : 'import_users.json'
		});
	},
	
	/**
	 * after import success
	 */
	onImportSuccess : function(response) {
		var gridView = this.getGridView();
		gridView.store.load();
	},
	
	/****************************************************************
	 ** 			여기서 부터는 abstract method, 필수 구현 				   **
	 ****************************************************************/	
	/**
	 * detail view type(popup | view | none)을 리턴
	 */	
	getDetailViewType : function() {
		return 'popup';
	},
	
	/**
	 * main view를 리턴 
	 */
	getMainView : function() {
		return this.getUser();
	},
	
	/**
	 * override
	 */
	getDefaultFilters : function() {
		return {};
	}	
});
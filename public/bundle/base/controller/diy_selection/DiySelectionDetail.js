/**
 * DiySelectionDetail controller
 */
Ext.define('Base.controller.diy_selection.DiySelectionDetail', {
	
	extend: 'Base.abstract.entity.DetailMainController',
	
	requires : [ 
		'Base.model.DiySelection', 
		'Base.store.DiySelection', 
		'Base.view.diy_selection.DiySelectionDetail'
	],
	
	models : ['Base.model.DiySelection'],
			
	stores: ['Base.store.DiySelection'],
	
	views : ['Base.view.diy_selection.DiySelectionDetail'],
	
	refs: [ { ref : 'DiySelectionDetail', selector : 'base_diy_selection_detail' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'base_diy_selection_detail' : {
				paramschange : this.onParamsChange,
				after_detail_loaded : this.afterDetailLoaded
			},
			' base_diy_selection_form' : {
				click_back : this.onBackClick,
				click_new :  this.onFormNew,
				click_save :  this.onFormSave,
				click_delete : this.onFormDelete,
				after_form_saved : this.afterFormSaved,
				after_form_deleted : this.afterFormDeleted
			},
			' base_diy_selection_in_params_list' : {
				click_back : this.onBackClick,
				click_add : this.onGridAdd,
				click_delete : this.onGridDelete,
				click_save :  this.onGridSave,
				after_grid_updated : this.afterGridUpdated
			},
			' base_diy_selection_out_params_list' : {
				click_back : this.onBackClick,
				click_add : this.onGridAdd,
				click_delete : this.onGridDelete,
				click_save :  this.onGridSave,
				after_grid_updated : this.afterGridUpdated
			},
			' base_diy_selection_test' : {
				click_back : this.onBackClick,
				click_invoke : this.onInvokeClick
			}
		});
	},
	
	/****************************************************************
	 ** 					여기는 customizing area 				   **
	 ****************************************************************/
	
	/**
	 * Invoke 버튼 클릭 시 
     * @testView
	 */
	onInvokeClick : function(testView) {
		var self = this;
		var testParamsForm = testView.child('form');
		var paramsStr = testParamsForm.getValues(true);
    	Ext.Ajax.request({
		    url: '/domains/' + login.current_domain_id + '/diy_selections/' + this.selectedRecord.get('name') + '/shoot.json?test=y',
		    method : 'POST',
		    params : paramsStr,
		    success : function(response) {
		        var res = Ext.JSON.decode(response.responseText);
				var testView = self.queryItem(null, 'base_diy_selection_test');
				testView.showResult(self.selectedRecord.get('service_out_params'), res);
			}
		});
	},
	
	/**
	 * grid의 xtype으로 파라미터 타입을 구분하여 리턴 
     * @grid
	 */
	getParameterType : function(grid) {
		return (grid.xtype == 'base_diy_selection_in_params_list') ? 'in' : 'out';
	},
	
	/**
	 * 모든 폼을 record로 다시 load
     * @record
	 */
	reloadAllForms : function(record) {
		var mainView = this.getMainView();
		HF.setTitle(T('title.diy_selection') + ' ' + record.get('name'));
		mainView.child('base_diy_selection_form').loadRecord(record);
	},
	
	/****************************************************************
	 ** 					Override 구현 						   **
	 ****************************************************************/
	/**
	 * override
	 */	
	getMultipleUpdateUrl : function(grid) {
		var parameterType = this.getParameterType(grid);
		return '/domains/' + login.current_domain_id + '/diy_selections/' + this.selectedRecord.get('id') + '/update_multiple_parameters.json?type=' + parameterType;
	},
	
	/**
	 * override
	 */
	afterDetailLoaded : function(record, operation) {
		this.selectedRecord = record;
		this.reloadAllForms(this.selectedRecord);
			
		var inParamsGrid = this.queryItem(null, 'base_diy_selection_in_params_list');
		var outParamsGrid = this.queryItem(null, 'base_diy_selection_out_params_list');
		var testView = this.queryItem(null, 'base_diy_selection_test');

		inParamsGrid.setRecord(this.selectedRecord);
		outParamsGrid.setRecord(this.selectedRecord);
		testView.setRecord(this.selectedRecord);
		
		// 생성할 새로운 레코드이면 name 필드를 활성화시킨다.
		if(!record.data.id) {
			var nameField = this.getMainView().child('base_diy_selection_form').child('#form_name');
			nameField.setReadOnly(false);
		}
	},
	
	/**
	 * override
	 */
	afterFormSaved : function(form, newRecord) {
		this.reloadAllForms(newRecord);
	},
	
	/**
	 * override
	 */
	afterFormDeleted : function(form, record, operation) {
		HF.history.back();
	},
	
	/**
	 * override
	 */
	afterGridUpdated : function(grid, updateType, response) {
		var res = Ext.JSON.decode(response.responseText);
		grid.store.loadRawData(res.items);
	},

	/****************************************************************
	 ** 					abstract method, 필수 구현 				   **
	 ****************************************************************/
	/**
	 * main view를 리턴 
	 */
	getMainView : function() {
		return this.getDiySelectionDetail();
	},
	
	/**
	 * 데이터 생성을 위한 새로운 엔티티 생성 
	 */
	newModel : function(grid, data) {
		return {
			id : '',
			name : '',
			description : '',
			resource_type : 'DiySelection',
			resource_id : this.selectedRecord.get('id'),
			rank : 0
		};
	}
});
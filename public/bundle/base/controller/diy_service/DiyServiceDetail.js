/**
 * DiyService controller
 */
Ext.define('Base.controller.diy_service.DiyServiceDetail', {
	
	extend: 'Base.abstract.entity.DetailMainController',
	
	requires : [ 
		'Base.model.DiyService', 
		'Base.store.DiyService', 
		'Base.view.diy_service.DiyServiceDetail'
	],
	
	models : ['Base.model.DiyService'],
			
	stores: ['Base.store.DiyService'],
	
	views : ['Base.view.diy_service.DiyServiceDetail'],
	
	refs: [ { ref : 'DiyServiceDetail', selector : 'base_diy_service_detail' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'base_diy_service_detail' : {
				paramschange : this.onParamsChange,
				after_detail_loaded : this.afterDetailLoaded
			},
			' base_diy_service_form' : {
				click_back : this.onBackClick,
				click_new :  this.onFormNew,
				click_save :  this.onFormSave,
				click_delete : this.onFormDelete,
				after_form_saved : this.afterFormSaved,
				after_form_deleted : this.afterFormDeleted
			},
			' base_diy_service_in_params_list' : {
				click_back : this.onBackClick,
				click_add : this.onGridAdd,
				click_delete : this.onGridDelete,
				click_save :  this.onGridSave,
				after_grid_updated : this.afterGridUpdated
			},
			' base_diy_service_out_params_list' : {
				click_back : this.onBackClick,
				click_add : this.onGridAdd,
				click_delete : this.onGridDelete,
				click_save :  this.onGridSave,
				after_grid_updated : this.afterGridUpdated
			},
			' base_diy_service_test' : {
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
		    url: '/domains/' + login.current_domain_id + '/diy_services/' + this.selectedRecord.get('name') + '/shoot.json?test=y',
		    method : 'POST',
		    params : paramsStr,
		    success : function(response) {
		        var res = Ext.JSON.decode(response.responseText);
				var testView = self.queryItem(null, 'base_diy_service_test');
				testView.showResult(self.selectedRecord.get('service_out_params'), res);
			}
		});
	},
	
	/**
	 * parameter type
	 */
	getParameterType : function(grid) {
		return (grid.xtype == 'base_diy_service_in_params_list') ? 'in' : 'out';
	},
	
	/****************************************************************
	 ** 					Override 구현 						   **
	 ****************************************************************/
	
	/**
	 * override
	 */
	afterDetailLoaded : function(record, operation) {
		this.selectedRecord = record;
		HF.setTitle(T('title.diy_service') + ' ' + record.get('name'));
		var inParamsGrid = this.queryItem(null, 'base_diy_service_in_params_list');
		var outParamsGrid = this.queryItem(null, 'base_diy_service_out_params_list');
		var testView = this.queryItem(null, 'base_diy_service_test');
		this.getBasicForm().loadRecord(this.selectedRecord);
		inParamsGrid.setRecord(this.selectedRecord);
		outParamsGrid.setRecord(this.selectedRecord);
		testView.setRecord(this.selectedRecord);
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
	
	/**
	 * override
	 */	
	getMultipleUpdateUrl : function(grid) {
		var parameterType = this.getParameterType(grid);
		return '/domains/' + login.current_domain_id + '/diy_services/' + this.selectedRecord.get('id') + '/update_multiple_parameters.json?type=' + parameterType;
	},
	
	/****************************************************************
	 ** 				abstract method, 필수 구현 					   **
	 ****************************************************************/
	/**
	 * main view를 리턴 
	 */
	getMainView : function() {
		return this.getDiyServiceDetail();
	},
	
	/**
	 * 데이터 생성을 위한 새로운 엔티티 생성 
	 */
	newModel : function(grid, data) {
		return {
			id : '',
			name : '',
			description : '',
			resource_type : 'DiyService',
			resource_id : this.selectedRecord.get('id'),
			rank : 0
		};
	}
});
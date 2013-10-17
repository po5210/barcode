/**
 * DiyReportDetail controller
 */
Ext.define('Base.controller.diy_report.DiyReportDetail', {
	
	extend: 'Base.abstract.entity.DetailMainController',
	
	requires : [ 
		'Base.model.DiyReport', 
		'Base.store.DiyReport', 
		'Base.view.diy_report.DiyReportDetail',
		'Base.view.diy_report.ViewGeneratorPopup'
	],
	
	models : ['Base.model.DiyReport'],
			
	stores: ['Base.store.DiyReport'],
	
	views : ['Base.view.diy_report.DiyReportDetail'],
	
	refs: [ { 
		ref : 'DiyReportDetail', selector : 'base_diy_report_detail' 
	}, {
		ref : 'ViewGeneratorPopup', selector : 'base_report_view_generator_popup'
	} ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'base_diy_report_detail' : {
				paramschange : this.onParamsChange,
				after_detail_loaded : this.afterDetailLoaded
			},
			' base_diy_report_form' : {
				click_back : this.onBackClick,
				click_save :  this.onFormSave,
				click_delete : this.onFormDelete,
				after_form_saved : this.afterFormSaved,
				after_form_deleted : this.afterFormDeleted,
				click_generate_view : this.onFormViewGen
			},
			' base_diy_report_in_params' : {
				click_back : this.onBackClick
			},
			' base_diy_report_out_params' : {
				click_back : this.onBackClick
			},
			' base_diy_report_test' : {
				click_back : this.onBackClick,
				click_invoke : this.onInvokeClick
			},
			'base_report_view_generator_popup' : {
				paramschange : this.onPopupParamsChange,
				click_generate :  this.onPopupGenerate,
				click_close : this.onPopupClose
			}
		});
	},
	
	/****************************************************************
	 ** 				여기는 customizing area 					   **
	 ****************************************************************/
	/**
	 * generate view button click
	 */	
	onFormViewGen : function(form) {
		HF.popup('Base.view.diy_report.ViewGeneratorPopup', { id : this.selectedRecord.get('id') }, {});
	},
	
	/**
	 * popup close button click시 
	 */
	onPopupClose : function(view) {
		view.close();
	},

	/**
	 * popup 호출시 
	 */
	onPopupParamsChange : function(view, params) {
		if(params.id) {
			Base.model.DiyReport.load(params.id, {
				success : function(record, operation) {
					view.setRecord(record);
				}
			});
		}
	},

	/**
	 * generate view button click 시 
	 */	
	onPopupGenerate : function(popup) {
		var record = popup.getRecord();
		var url = '/domains/' + login.current_domain_id + '/diy_reports/' + record.get('id') + '/generate_views.json';
		var formView = popup.child('form');
		var self = this;
		formView.getForm().submit({
		    clientValidation : true,
		    url : url,
			timeout : 20000,
		    success: function(form, action) {
				var result = action.result;
				var message = result.msg;
				self.showPopupResult(T('title.' + (result.result ? 'success' : 'failure')), message);
		    }
		});
	},
	
	/**
	 * 결과 창 표시
	 */
	showPopupResult : function(title, result) {
		Ext.create('Ext.window.Window', {
		    title: title,
		    height: 400,
		    width: 800,
			autoScroll : true,
		    layout: 'fit',
		    items: {
		        xtype: 'panel',
		        border: false,
		        defaults : { xtype : 'textarea', anchor : '100%' },
		        layout : 'fit',
		        items : [{
		            name : 'test',
		            value : result
		        }]
		    }
		}).show();
	},
	
	/**
	 * Invoke 버튼 클릭 시 
     * @testView
	 */
	onInvokeClick : function(testView) {
		var self = this;
		var testParamsForm = testView.child('form');
		var paramsStr = testParamsForm.getValues(true);
    	Ext.Ajax.request({
		    url: self.selectedRecord.get('service_url'),
		    method : 'GET',
		    params : paramsStr,
		    success : function(response) {
		        var res = Ext.JSON.decode(response.responseText);
				var testView = self.queryItem(null, 'base_diy_report_test');
				testView.showResult(self.selectedRecord.get('service_out_params'), res);
			}
		});
	},
	
	/**
	 * 선택 record 변경시 Detail 페이지의 모든 탭을 리프레쉬 
	 */
	refreshDetails : function(record) {
		var self = this;
		Base.model.DiyReport.load(record.get('id'), {
			scope : this,
			success : function(newRecord, operation) {
				self.selectedRecord = newRecord;
				self.getMainView().setRecord(newRecord);
				var inParamsGrid = self.queryItem(null, 'base_diy_report_in_params');
				var outParamsGrid = self.queryItem(null, 'base_diy_report_out_params');
				var testView = self.queryItem(null, 'base_diy_report_test');
				inParamsGrid.setRecord(self.selectedRecord);
				outParamsGrid.setRecord(self.selectedRecord);
				testView.setRecord(self.selectedRecord);
			}
		});
	},

	/****************************************************************
	 ** 					Override 구현 						   **
	 ****************************************************************/
	
	/**
	 * override
	 */
	afterDetailLoaded : function(record, operation) {
		this.refreshDetails(record);
	},
	
	/**
	 * override
	 */
	afterFormSaved : function(form, newRecord) {
		this.refreshDetails(newRecord);
	},
	
	/**
	 * override
	 */
	afterFormDeleted : function(form, newRecord) {
		HF.history.back();
	},
	
	/****************************************************************
	 ** 					abstract method, 필수 구현 				   **
	 ****************************************************************/
	/**
	 * main view를 리턴 
	 */
	getMainView : function() {
		return this.getDiyReportDetail();
	}
});
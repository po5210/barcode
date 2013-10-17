/**
 * EntityDetail controller
 */
Ext.define('Base.controller.entity.EntityDetail', {

	extend: 'Base.abstract.entity.DetailMainController',

	requires : [ 
		'Base.model.Entity', 
		'Base.store.Entity', 
		'Base.view.entity.EntityDetail',
		'Base.view.entity.ViewGeneratorPopup',
		'Base.view.entity.ApiGeneratorPopup',
		'Base.view.entity.ModelGeneratorPopup'
	],

	models : ['Base.model.Entity'],

	stores: ['Base.store.Entity'],

	views : ['Base.view.entity.EntityDetail'],

	refs: [ { 
		ref : 'EntityDetail', selector : 'base_entity_detail' 
	}, {
		ref : 'ViewGeneratorPopup', selector : 'base_view_generator_popup' 
	}, {
		ref : 'ApiGeneratorPopup', selector : 'base_api_generator_popup' 
	}, {
		ref : 'ModelGeneratorPopup', selector : 'base_model_generator_popup'
	} ],

	init: function() {
		this.callParent(arguments);

		this.control({
			'base_entity_detail' : {
				paramschange : this.onParamsChange,
				after_detail_loaded : this.afterDetailLoaded
			},
			' base_entity_form' : {
				click_back : this.onBackClick,
				click_save :  this.onFormSave,
				click_delete : this.onFormDelete,
				click_generate_api : this.onFormApiGen,
				click_generate_model : this.oFormModelGen,
				click_generate_view : this.onFormViewGen,
				click_generate_table : this.oFormTableGen,
				after_form_saved : this.afterFormSaved,
				after_form_deleted : this.afterFormDeleted
			},
			'base_entity_column_list' : {
				click_back : this.onBackClick,
				click_create : this.onCreateClick,
				click_add : this.onGridAdd,
				click_save : this.onGridSave,
				click_delete : this.onGridDelete,
				after_grid_updated : this.afterGridUpdated,
				click_locale : this.onLocaleClick
			},
			'base_view_generator_popup' : {
				paramschange : this.onPopupParamsChange,
				click_generate : this.onPopupGenerate,
				click_close : this.onPopupClose
			},
			'base_api_generator_popup' : {
				paramschange : this.onPopupParamsChange,
				click_generate : this.onPopupGenerate,
				click_close : this.onPopupClose
			},
			'base_model_generator_popup' : {
				paramschange : this.onPopupParamsChange,
				click_generate : this.onPopupGenerate,
				click_close : this.onPopupClose
			}
		});
	},

	/****************************************************************
	 ** 					여기는 customizing area 					**
	 ****************************************************************/
	/**
	 * Generation 가능한지 체크 
	 */
	checkGeneration : function() {
		if(this.selectedRecord.get('bundle') == 'base') {
			HF.msg.notice(T('text.Base bundle not allowed'));
			return false;
		} else {
			return true;
		}
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
			Base.model.Entity.load(params.id, {
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
		var self = this;
		var urlMethodName = '';
		var popupType = popup.xtype;

		if(popupType == 'base_api_generator_popup') {
			urlMethodName = 'generate_api';
		} else if(popupType == 'base_model_generator_popup') {
			urlMethodName = 'generate_model';
		} else if(popupType == 'base_view_generator_popup') {
			urlMethodName = 'generate_views';
		}

		if(urlMethodName == '') {
			HF.msg.notice(T('text.Invalid data'));
			return;
		}

		var record = popup.getRecord();
		var url = '/domains/' + login.current_domain_id + '/entities/' + record.get('id') + '/' + urlMethodName + '.json';
		var formView = popup.child('form');
		formView.getForm().submit({
		    clientValidation : true,
		    url : url,
			timeout : 20000,
		    success: function(form, action) {
				var result = action.result;
				popup.close();
				self.showPopupResult(T('title.' + (result.result ? 'success' : 'failure')), result.msg);
		    }
		});
	},

	/**
	 * multiple update url을 리턴 
	 */
	getMultipleUpdateUrl : function(grid) {
		return '/domains/' + login.current_domain_id + '/entities/' + this.selectedRecord.get('id') + '/update_multiple_entity_columns.json';
	},

	/**
	 * create click시  
	 */
	onCreateClick : function(columnsGrid) {
		HF.msg.confirm({ 
			title : T('title.confirm'), 
			msg : T('text.Sure to Create Fields'), 
			fn : function(confirmBtn) {
				if(confirmBtn != 'yes') 
					return;

				var url = '/domains/' + login.current_domain_id + '/entities/' + this.selectedRecord.get('id') + '/create_entity_columns.json';
				Ext.Ajax.request({
					url: url,
					method : 'POST',
					success: function(response) {
						var res = Ext.JSON.decode(response.responseText);
						columnsGrid.store.loadRawData(res.items);
		    		}
				});
			},
			scope : this
		});
	},

	/**
	 * override
	 */
	afterGridUpdated : function(grid, updateType, response) {
		var res = Ext.JSON.decode(response.responseText);
		grid.store.loadRawData(res.items);
	},

	/**
	 * entity column list view 
	 */
	getEntityColumnsView : function() {
		return this.queryItem(null, 'base_entity_column_list');
	},

	/**
	 * generate view button click
	 */	
	onFormViewGen : function(form) {
		if(this.checkGeneration()) {
			HF.popup('Base.view.entity.ViewGeneratorPopup', { id : this.selectedRecord.get('id') }, {});
		}
	},

	/**
	 * generate api button click
	 */	
	onFormApiGen : function(form) {
		if(this.checkGeneration()) {
			HF.popup('Base.view.entity.ApiGeneratorPopup', { id : this.selectedRecord.get('id') }, {});
		}
	},

	/**
	 * generate table button click시 
	 */
	oFormTableGen : function(view) {
		if(this.checkGeneration()) {
			HF.msg.confirm({
				title : T('title.confirm'), 
				msg : T('text.Sure to Generate Table'), 
				fn : function(confirmBtn) {
					if(confirmBtn == 'yes') {
						Ext.Ajax.request({
							url: '/domains/' + login.current_domain_id + '/entities/generate_table.json',
							method : 'POST',
							success: function(response) {
								var res = Ext.JSON.decode(response.responseText);
								this.showPopupResult(T('title.' + (res.result ? 'success' : 'failure')), res.msg);
				    		},
							scope : this
						});
					}
				},
				scope : this
			});
		}
	},

	/**
	 * generate model button click시 
	 */
	oFormModelGen : function(view) {
		HF.popup('Base.view.entity.ModelGeneratorPopup', { id : this.selectedRecord.get('id') }, {});
	},

	/**
	 * locale button click 시
	 */
	onLocaleClick : function(view) {
		var selectView = this.getMainView();
		var grid = selectView.child("base_entity_column_list");
		var selectionModel = grid.getSelectionModel();
		var model = selectionModel.getSelection();

		var arrName = [];
		for(i = 0 ; i < model.length ; i++) {
			arrName.push("'" + model[i].data.name + "'" + " : " + "'" + HF.humanize(model[i].data.name) + "'");
		}

		this.showPopupResult('Local', arrName.join(',\n'));
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

	/****************************************************************
	 ** 					Override 구현 						   **
	 ****************************************************************/
	/**
	 * override
	 */
	afterDetailLoaded : function(record, operation) {
		this.selectedRecord = record;
		this.getMainView().setRecord(record);
		var entityColumnList = this.getEntityColumnsView();
		Ext.Ajax.request({
			url: '/domains/' + login.current_domain_id + '/entities/' + record.get('id') + '/entity_columns.json',
			method : 'GET',
			success: function(response) {
				var res = Ext.JSON.decode(response.responseText);
				entityColumnList.store.loadRawData(res.items);
			}
		});
	},

	/**
	 * override
	 */
	afterFormSaved : function(form, newRecord) {
		this.getMainView().setRecord(newRecord);
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
		return this.getEntityDetail();
	},

	/**
	 * 데이터 생성을 위한 새로운 엔티티 생성 
	 */
	newModel : function(grid, data) {
		return data || {
			id : '',
			entity_id : this.selectedRecord.get('id'),
			name : '',
			description : '',
			ref_type : '',
			ref_name : '',
			column_type : 'string',
			pk : false,
			editable : false,
			list_rank : 0,
			search_rank : 0,
			sort_rank : 0,
			reverse_sort : false,
			display_rank : 0,
			_cud_flag_ : ''
		};
	}
});
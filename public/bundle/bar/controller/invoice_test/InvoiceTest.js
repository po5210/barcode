/**
 * Loc controller
 */
Ext.define('Bar.controller.invoice_test.InvoiceTest', {
	
	extend: 'Base.abstract.entity.ListMainController',
	
	requires : [ 
		'Bar.model.InvoiceTest', 
		'Bar.store.InvoiceTest', 
		'Bar.view.invoice_test.InvoiceTest' 
	],
	
	models : ['Bar.model.InvoiceTest'],
			
	stores: ['Bar.store.InvoiceTest'],
	
	views : ['Bar.view.invoice_test.InvoiceTest'],
	
	refs: [ { ref : 'InvoiceTest', selector : 'bar_invoice_test' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'bar_invoice_test' : {
				paramschange : this.onParamsChange
			},
			'bar_invoice_test_list' : {
				after_grid_updated : this.afterGridUpdated
			},
			'bar_invoice_test_form' : {
				click_new : this.onResetClick,
				click_save : this.onFormSave,
				click_delete : this.onGridDelete,
				click_input : this.onInput,
				after_grid_updated : this.afterGridUpdated
			},
			'bar_invoice_test_search' : {
				click_search : this.onSearchClick,
				click_reset : this.onResetClick,
				afterrender : this.onSearchRender
			}
		});
	},

	/****************************************************************
	 ** 			여기는 customizing area 						   **
	 ****************************************************************/
	/**
	 * entry point
	 *
	 * @return
	 */	
	onParamsChange: function(view, params) {
		params = this.beforeParamsChange(view, params);
		if(this.validateParams(view, params)) {
			var searchForm = this.getSearchForm();
			searchForm.setValues(params);
			
			// bill_nb가 선택되었을 경우에만 서버 호출 
			if(params.bill_nb && params.bill_nb.id) {
				var store = Ext.getStore('Bar.store.InvoiceTest');
				store.proxy.extraParams = { bill_nb : params.bill_nb.id };
				store.load({
					scope: this,
					callback: function(records, operation, success) {
						if(success) {
							// 결과 셋 파싱
							var resultSet = Ext.JSON.decode(operation.response.responseText);
							// 마스터 데이터로 폼에 설정 
							var master = resultSet.master;
							var formValues = searchForm.getValues();
							formValues.tr_cd = master.tr_cd;
							formValues.bill_dt = master.bill_dt;
							formValues.invoice_date = master.invoice_date;
							formValues.invoice_no = master.invoice_no;
							formValues.po_no = master.po_no;
							searchForm.setValues(formValues);
							// 디테일 데이터로 그리드 스토어에 로딩 
							this.getGridView().store.loadRawData(resultSet.items);
						}
					}
				});
			}
		}
	},
	
	/**
	 * before params change
	 *
	 * @return
	 */		
	beforeParamsChange : function(view, params) {
		if(!params) {
			params = {};
		}
		
		if(!params['bill_dt']) {
			params['bill_dt'] = HF.getCurrentShiftDate();
		}
		
		if(!params['po_no']) {
			params['po_no'] = 'GQBA-PL-';	
		}
		
		return params;
	},
		
	/**
	 * delete button click
	 */			
	onGridDelete : function(view) {
		var gridView = this.getGridView();
		var selections = gridView.getSelectionModel().getSelection();
		if(selections.length > 0) {
			gridView.store.remove(selections[0]);
		} else {
			HF.msg.notice(T('text.Nothing selected'));
		}		
	},
	
	/**
	 * Search View가 Rendering된 후...
	 */
	onSearchRender : function(view) {
		// Item 필드의 entitynamecombo의 값 변경 이벤트를 잡는다.
		var itemField = view.down(' entitysearchcombo[name=item_cd]');
		var itemNameCombo = itemField.down(' entitynamecombo');
		
		// item 필드가 변경되었을 경우 Search View의 Lot Size 필드를 변경
		itemNameCombo.on('select', function(me, records) {
			var record = records[0];
			var lotSizeField = view.down(' textfield[name=lot_size]');
			lotSizeField.setValue(record.raw.default_qty);
		});		
	},

	/**
	 * 검색 조건의 Reset 버튼, New 버튼이 클릭되었을 경우
	 * 모든 검색 조건을 reset 한 후 bill date, po no 값은 기본 값으로 유지한다.
	 */
	onResetClick : function(view) {
		var searchView = this.getSearchView();
		searchView.getForm().reset();
		var billDateField = searchView.down(' datefield[name=bill_dt]');
		billDateField.setValue(HF.getCurrentShiftDate());
		var poNoField = searchView.down(' textfield[name=po_no]');
		poNoField.setValue('GQBA-PL-');		
	},
	
	/**
	 * 폼 버튼 클릭시 
	 */
	onFormSave : function(view) {
		var searchView = this.getSearchView();
		var form = searchView.getForm();
		if (this.validateLogic(form)) {
			HF.msg.confirm({
				msg : T('text.Sure to Save'),
				fn : function(btn) {
					if(btn == 'yes') {
						var invoice_test = this.createDataModel(form);
						invoice_test.save({
							success : function(record, operation) {
								HF.msg.success(T('text.Success to Save'));
								// save 후 search condition bill_nb 필드에 선택이 되도록한다.
								var newRecord = operation.resultSet.records[0];
								var values = form.getValues();
								values.bill_nb = newRecord.data.bill_nb;
								form.setValues(values);
							}
						});						
					}
				},
				scope: this
			});
		}
	},
	
	/**
	 * InvoiceTest 저장을 위해서 Form, Grid의 데이터로 부터 데이터 모델을 생성한다.
	 */
	createDataModel : function(form) {
		var gridView = this.getGridView();
		var store = gridView.store;
		var itemInfos = [];
		// grid에서 새로 추가된 row만 처리한다.
		this.getStoreRecords(store, 'c', itemInfos);
		var values = form.getValues();
		values.item_info = itemInfos;
		return Ext.create('Bar.model.InvoiceTest', values);
	},
	
	/**
	 * 추가적으로 필요한 validation을 수행 
	 */
	validateLogic : function(form) {
		var formValues = form.getValues();
		if(!formValues.tr_cd || Ext.String.trim(formValues.tr_cd) == '') {
			HF.msg.notice(T('text.Empty data exist') + " : " + T('label.tr_cd'));
			return false;
		}
				
		if(!formValues.invoice_no || Ext.String.trim(formValues.invoice_no) == '') {
			HF.msg.notice(T('text.Empty data exist') + " : " + T('label.invoice_no'));
			return false;
		}
		
		if(!formValues.po_no || Ext.String.trim(formValues.po_no) == '' || formValues.po_no == 'GQBA-PL-') {
			HF.msg.notice(T('text.Empty data exist') + " : " + T('label.po_no'));
			return false;
		}
		
		if(formValues.invoice_date == '') {
			HF.msg.notice(T('text.Empty data exist') + " : " + T('label.invoice_date'));
			return false;
		}
		
		return true;
	},
	
	/**
	 * Input 버튼 클릭시 
	 */
	onInput : function(view) {
		var searchView = this.getSearchView();
		var form = searchView.getForm();
		
		// validation
		if(!this.validateLogic(searchView.getForm()) || !this.validateInputLogic(form)) {
			return;
		}
		
		var itemObj = searchView.down(' entitysearchcombo[name=item_cd]');
		var itemDescText = itemObj.down(' textfield[name=item_cd-desc]');
		
		// grid에 추가하기 위해서 search form에 입력된 값들을 복사하고 필요한 값들은 계산한다.
		var formValues = form.getValues();
		var gridData = Ext.clone(formValues);
		gridData["item_nm"] = itemDescText.getValue();
		gridData["lot_qt"] = Math.ceil(gridData.bill_qt / gridData.lot_size);
		gridData["price"] = gridData.bill_qt * gridData.unit_price;
		
		// grid store에 row 하나 추가.
		var gridView = this.getGridView();
		gridView.store.add(gridData);
		
		// Search Form에서 Item, Lot Size, Unit Price, Bill Qty값을 리셋한다.
		itemObj.resetValue();
		searchView.down(' textfield[name=lot_size]').setValue(0);
		searchView.down(' numberfield[name=unit_price]').setValue(0);
		searchView.down(' numberfield[name=bill_qt]').setValue(0);
	},
	
	/**
	 * input button click 전 validation
	 */
	validateInputLogic : function(form) {
		var formValues = form.getValues();
		
		// validation : item_cd, lot_size, unit_price, bill_qt중 하나라도 없으면 invalid
		if(!formValues.item_cd) {
			HF.msg.notice(T('text.Empty data exist') + " : " + T('label.item'));
			return false;
		}
		
		if(!formValues.unit_price || formValues.unit_price == 0) {
			HF.msg.notice(T('text.Empty data exist') + " : " + T('label.unit_price'));
			return false;
		}
		
		if(!formValues.bill_qt || formValues.bill_qt == 0) {
			HF.msg.notice(T('text.Empty data exist') + " : " + T('label.bill_qt'));
			return false;
		}
		
		return true;
	},
	
	/****************************************************************
	 ** 			여기서 부터는 abstract method, 필수 구현 			   **
	 ****************************************************************/
	/**
	 * detail view type(popup | view | none)을 리턴
	 */	
	getDetailViewType : function() {
		return 'none';
	},
	
	/**
	 * main view를 리턴 
	 */
	getMainView : function() {
		return this.getInvoiceTest();
	}
});
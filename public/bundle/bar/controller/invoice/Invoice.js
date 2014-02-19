/**
 * Loc controller
 */
Ext.define('Bar.controller.invoice.Invoice', {
	
	extend: 'Base.abstract.entity.ListMainController',
	
	requires : [ 
		'Bar.model.Invoice', 
		'Bar.store.Invoice', 
		'Bar.view.invoice.Invoice' 
	],
	
	models : ['Bar.model.Invoice'],
			
	stores: ['Bar.store.Invoice'],
	
	views : ['Bar.view.invoice.Invoice', 'Bar.view.invoice.InvoiceReprint'],
	
	refs: [ { ref : 'Invoice', selector : 'bar_invoice' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'bar_invoice' : {
				paramschange : this.onParamsChange
			},
			'bar_invoice_list' : {
				click_invoice : this.onPrintInvoice,
				click_print : this.onPrintInvDetail,
				click_reprint : this.onReprintInvDetail,
				after_grid_updated : this.afterGridUpdated
			},
			'bar_invoice_form' : {
				click_new : this.onResetClick,
				click_save : this.onFormSave,
				click_delete : this.onGridDelete,
				click_apply_invoice : this.onInput,
				after_grid_updated : this.afterGridUpdated
			},
			'bar_invoice_search' : {
				click_search : this.onSearchClick,
				click_reset : this.onResetClick,
				afterrender : this.onSearchRender
			}
		});
	},

	/****************************************************************
	 ** 			여기는 Invoice print 						   		**
	 ****************************************************************/	
	/**
	 * Invoice 버튼 클릭시
	 */
	onPrintInvoice : function(view) {
		var billNb = this.getSearchForm().getValues().bill_nb;
		
		if(billNb) {
			// print command 정보를 서버에서 가져온다.
			Ext.Ajax.request({
				url : '/domains/' + login.current_domain_id + '/invoices/' + billNb + '/print_master.json',
				method : 'GET',
				success : function(response) {
					var result = Ext.JSON.decode(response.responseText);
					this.printLabel(billNb, result.print_command);
				},
				scope : this
			});
		} else {
			HF.msg.notice(T('text.Empty data exist') + " : " + T('label.bill_nb'));
		}
	},
	
	/**
	 * Print Agent에 인쇄 요청 
	 */	
	printLabel : function(billNb, command) {
		var message = { "billId" : billNb, "msgType" : "PRINT", "msg" : command };
		var reqMsg = HF.agent.buildRequestMsg(message);
		HF.agent.request(reqMsg, function(response) {
			if(response.success) {
				// Print Y/N 서버에 업데이트 
				this.updatePrinted(billNb);
			} else {
				// 메시지 뿌리기 
				var errMsg = response.msg + ' (' + response.details + ')';
				HF.failure(errMsg);
			}
		}, this);
	},
	
	/**
	 * 마스터 라벨 인쇄 플래그 올리기
	 */
	updatePrinted : function(billNb) {
		Ext.Ajax.request({
			url : '/domains/' + login.current_domain_id + '/invoices/' + billNb + '/update_to_printed.json',
			method : 'GET',
			success : function(response) {
				HF.msg.notice(T('text.Success to Process'));
			},
			scope : this
		});		
	},
	
	/**
	 * Print 버튼 클릭시
	 */	
	onPrintInvDetail : function(view) {
		var billNb = this.getSearchForm().getValues().bill_nb;
		
		if(billNb) {
			// print command 정보를 서버에서 가져온다.
			Ext.Ajax.request({
				url : '/domains/' + login.current_domain_id + '/invoices/' + billNb + '/print_detail.json',
				method : 'GET',
				success : function(response) {
					var result = Ext.JSON.decode(response.responseText);
					this.printLabels(billNb, result.commands, 0);
				},
				scope : this
			});
		} else {
			HF.msg.notice(T('text.Empty data exist') + " : " + T('label.bill_nb'));
		}
	},
	
	/**
	 * Print Agent에 인쇄 요청 
	 */	
	printLabels : function(billNb, commands, idx) {		
		var message = { "billId" : billNb + idx, "msgType" : "PRINT", "msg" : commands[idx] };
		var reqMsg = HF.agent.buildRequestMsg(message);
		
		HF.agent.request(reqMsg, function(response) {
			if(response.success) {
				// 재귀호출
				if(commands.length > idx) {
					this.printLabels(billNb, commands, idx + 1); 
				}
			} else {
				// 메시지 뿌리기 
				var errMsg = response.msg + ' (' + response.details + ')';
				HF.failure(errMsg);
			}
		}, this);
	},
		
	/**
	 * Reprint 버튼 클릭시
	 */	
	onReprintInvDetail : function(btn) {
//		var view = this.getMainView();
//		var selectionModel = view.child('grid').getSelectionModel();
//		var orders = selectionModel.getSelection();
		
		var gridView = this.getGridView();
		var selections = gridView.getSelectionModel().getSelection();
		if(selections.length > 0) {
			console.log(selections[0]);
			HF.popup('Bar.view.invoice.InvoiceReprint', selections[0], {});
		} else {
			HF.msg.notice(T('text.Nothing selected'));
		}
		
		
		
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
				var store = Ext.getStore('Bar.store.Invoice');
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
			if(record.raw.default_qty =="0"){
				HF.msg.notice(T('text.INF101'));
				itemField.resetValue();
				return false;				
			}else{
				var lotSizeField = view.down(' textfield[name=lot_size]');
				lotSizeField.setValue(record.raw.default_qty);
				var cusPartNoField = view.down(' textfield[name=cus_part_no]');
				cusPartNoField.setValue(record.raw.cus_part_name);
			}
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
		
		var gridView = this.getGridView();
		gridView.store.removeAll();
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
						var invoice = this.createDataModel(form);
						invoice.save({
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
	 * Invoice 저장을 위해서 Form, Grid의 데이터로 부터 데이터 모델을 생성한다.
	 */
	createDataModel : function(form) {
		var gridView = this.getGridView();
		var store = gridView.store;
		var itemInfos = [];
		// grid에서 새로 추가된 row만 처리한다.
		this.getStoreRecords(store, 'c', itemInfos);
		var values = form.getValues();
		values.item_info = itemInfos;
		return Ext.create('Bar.model.Invoice', values);
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
		gridData["cust_part_no"] = gridData.cus_part_no;
		
		// grid store에 row 하나 추가.
		var gridView = this.getGridView();
		gridView.store.add(gridData);
		
		// Search Form에서 Item, Lot Size, Unit Price, Bill Qty값을 리셋한다.
		itemObj.resetValue();
		searchView.down(' textfield[name=cus_part_no]').setValue('');
		searchView.down(' textfield[name=lot_size]').setValue(0);		
		searchView.down(' numberfield[name=unit_price]').setValue(0);
		searchView.down(' numberfield[name=bill_qt]').setValue(0);
		
	},
	
	/**
	 * apply_invoice button click 전 validation
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
	
	/**
	 * PART_NO, PART_NAME 정보 불러오기
	 */
	getPartInfo : function(itemCd) {
		Ext.Ajax.request({
				url : '/domains/' + login.current_domain_id + '/invoices/' + itemCd + '/get_part_info.json',
				method : 'GET',
				success : function(response) {
					var result = Ext.JSON.decode(response.responseText);
					return result.cust_part_no;
				},
				scope : this
			});
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
		return this.getInvoice();
	}
});
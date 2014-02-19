/**
 * BarMatout controller
 */
Ext.define('Bar.controller.bar_matout.BarMatout', {
	
	extend: 'Base.abstract.entity.ListMainController',
	
	requires : [ 
		'Bar.model.BarMatout', 
		'Bar.store.BarMatout', 
		'Bar.view.bar_matout.BarMatout' 
	],
	
	models : ['Bar.model.BarMatout'],
			
	stores: ['Bar.store.BarMatout'],
	
	views : ['Bar.view.bar_matout.BarMatout'],
	
	refs: [ { ref : 'BarMatout', selector : 'bar_bar_matout' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'bar_bar_matout' : {
				paramschange : this.onParamsChange,
				//after_import : this.onImportSuccess
			},
			'bar_bar_matout_list' : {
				click_new : this.onResetClick,
				click_save : this.onGridSave,				
				click_delete : this.onGridDelete,
				click_print : this.onPrintInvDetail,
				click_export : this.onExport,
				after_grid_updated : this.afterGridUpdated				
			},
			'bar_bar_matout_search' : {
				click_search : this.onSearchClick,
				click_reset : this.onResetClick,
				afterrender : this.onSearchRender
			},
			'bar_bar_matout #scan_master' : {
				keydown : this.masterTextKeyDown
			},
		});
	},

	/****************************************************************
	 ** 			여기는 customizing area 						   **
	 ****************************************************************/
	/**
	 * after import success
	 */
	onImportSuccess : function(response) {
		var gridView = this.getGridView();
		gridView.store.load();
	},
	
	onSearchRender : function() {
	},
	
	/**
	 * master label scan시  
	 */
	masterTextKeyDown : function(f, e) {
		if(e.keyCode == 13) {
			if(f.getValue()) {
				var barcode = f.getValue();				
				var barcodeArr = barcode.split('|');
				var barcodeArrLen = barcodeArr.length;
				
				if(barcodeArrLen  != 5 ) {					
					HF.msg.notice(T('text.Invalid Barcode Info'));
				} else {
					alert(barcode);
					barcode = barcode.trim();
					barcode = barcode.toUpperCase();
					this.scanMaster(f, barcode);
					//this.onSearchClick(null);	
				}
			} else {
				HF.msg.notice(T('text.Invalid Label'));
			}
		}
	},
		
	/**
	 * Master Label scan시 
	 */
	scanMaster : function(f, barcode) {
		var barcodeArr = barcode.split('|');
		var barcodeArrLen = barcodeArr.length;
		var billNb = barcodeArr[0];
		var itemCd = barcodeArr[1];
		var serialNo = barcodeArr[2];
		var lotQty = barcodeArr[3];
		var lotNo = barcodeArr[4];
		var detailList = [];
		
		Ext.Ajax.request({
			url : '/domains/' + login.current_domain_id + '/bar_matoutss/matout_info.json',
			method : 'GET',
			
			params : { barcode : barcode, bill_nb : billNb, item_cd : itemCd, serial_no : serialNo, lot_qty : lotQty, lot_no : lotNo },
			success : function(response) {
				var result = Ext.JSON.decode(response.responseText);
				// search form에 데이터 추가 - tr_cd, tr_nm
				var searchForm = this.getSearchForm();
				var formValues = searchForm.getValues();
				formValues.bill_nb = billNb;
				formValues.invoice_no = invoiceNo;
				invoiceDt = Ext.Date.parse(invoiceDate, "Ymd");
				formValues.invoice_date = Ext.Date.format(invoiceDt, 'Y-m-d');
				
				formValues.po_no = poNo;
				formValues.tr_cd = billNb.substring(1,6);
				formValues.bill_dt = billDt;
				searchForm.setValues(formValues);
		
				// grid에 데이터 추가 - item_nm, lot_size, box_qty, ....
				var gridView = this.getGridView();
				gridView.store.loadRawData(result.master.details);				
				
				f.reset();	
				f.disable();	
			},
			scope : this
		});
	},
	
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
			var scanMaster = view.child(' #scan_master');
					
			// bill_nb가 선택되었을 경우에만 서버 호출 
			if(params.who_dt && params["bar_locmap.name-eq"]  && scanMaster.getValue() ) {
				var store = this.getGridView().store;
				store.proxy.extraParams = { who_dt : params.who_dt, locmap_name :  params["bar_locmap.name-eq"], barcode : scanMaster.getValue()  };
				store.load();
			}
		}
	},
	
	/**
	 * Excel Export
	 *
	 * @return
	 */		
	getExportUrl : function() {
		return 'domains/' + login.current_domain_id + '/bar_matouts.xls';
	},
	
	/**
	 * export : 클라이언트에서는 검색 조건으로 요청만 하고 서버에서 데이터를 생성해서 엑셀로 내려줌 
	 */
	onExport : function() {
		params = this.beforeParamsChange(view, params);
		if(this.validateParams(view, params)) {
			var searchForm = this.getSearchForm();
			searchForm.setValues(params);
			var scanMaster = view.child(' #scan_master');
					
			// 검색결과가 있을때 가 선택되었을 경우에만 서버 호출 
			if(params.who_dt && params["bar_locmap.name-eq"]  && scanMaster.getValue() ) {
				var searchFormView = this.getSearchView();
				var params = { who_dt : params.who_dt, locmap_name :  params["bar_locmap.name-eq"], barcode : scanMaster.getValue()  }
				var paramStr = Ext.Object.toQueryString(params);
				window.location.href = this.getExportUrl() + '?' + paramStr;
			} else{
				HF.msg.notice(T('text.Empty data exist') );
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
		
		if(!params['who_dt']) {
			params['who_dt'] = HF.getCurrentShiftDate();
		}
			
		return params;
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
			
	/****************************************************************
	 ** 			여기서 부터는 abstract method, 필수 구현 				   **
	 ****************************************************************/
	
	
	/**
	 * main view를 리턴 
	 */
	getMainView : function() {
		return this.getBarMatout();
	}
});
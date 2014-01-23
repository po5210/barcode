/**
 * Loc controller
 */
Ext.define('Bar.controller.instock.Instock', {
	
	extend: 'Base.abstract.entity.ListMainController',
	
	requires : [ 
		'Bar.model.Instock', 
		'Bar.store.Instock', 
		'Bar.view.instock.Instock' 
	],
	
	models : ['Bar.model.Instock'],
			
	stores: ['Bar.store.Instock'],
	
	views : ['Bar.view.instock.Instock'],
	
	refs: [ 
		{ ref : 'Instock', selector : 'bar_instock' },
		{ ref : 'SubGridView', selector : 'bar_instock_sublist' } 
	],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'bar_instock' : {
				paramschange : this.onParamsChange,
				afterrender : this.onInstockRender
			},
			'bar_instock #scan_master' : {
				keydown : this.masterTextKeyDown
			},
			'bar_instock #scan_detail' : {
				keydown : this.detailTextKeyDown
			},			
			'bar_instock_list' : {
				click_new : this.onResetClick,
				click_temp_save : this.onTempSave,
				click_save : this.onGridSave
			},
			'bar_instock_sublist' : {
				click_print : this.onPrintLabel
			},
			'bar_instock_search' : {
				click_search : this.onSearchClick,
				click_reset : this.onResetClick
			}
		});
	},

	/****************************************************************
	 ** 			여기는 scan logic 						   		**
	 ****************************************************************/
	/**
	 * master label scan시  
	 */
	masterTextKeyDown : function(f, e) {
		if(e.keyCode == 13) {
			if(f.getValue()) {
				var barcode = Ext.String.trim(f.getValue());
				if(barcode == '') {
					HF.msg.notice(T('text.Invalid Label'));
				} else {
					barcode = barcode.toUpperCase();
					this.scanMaster(barcode);
					f.reset();					
				}
			} else {
				HF.msg.notice(T('text.Invalid Label'));
			}
		}
	},
	
	/**
	 * detail label scan시  
	 */	
	detailTextKeyDown : function(f, e) {
		if(e.keyCode == 13) {
			if(f.getValue()) {
				var barcode = Ext.String.trim(f.getValue());
				if(barcode == '') {
					HF.msg.notice(T('text.Invalid Label'));
				} else {
					barcode = barcode.toUpperCase();
					this.scanDetail(barcode);
					f.reset();					
				}
			} else {
				HF.msg.notice(T('text.Invalid Label'));
			}
		}
	},
	
	/**
	 * Master Label scan시 
	 */
	scanMaster : function(barcode) {
		var barcodeArr = barcode.split('|');
		var barcodeArrLen = barcodeArr.length;
		var billNb = barcodeArr[0];
		var invoiceNo = barcodeArr[1];
		var invoiceDate = barcodeArr[2];
		var poNo = barcodeArr[3];
		var billDt = barcodeArr[4];
		var detailList = [];
		
		for(var i = 5 ; i < barcodeArrLen ; i++) {
			// 레코드 바뀜 
			if(i % 4 == 1) {
				var detail = {"bill_nb" : billNb, "item_sq" : barcodeArr[i]};
				detailList.push(detail);
			} else {
				var detail = detailList[detailList.length - 1];
				var idx = (i % 4);
				if(idx == 2) {
					detail["item_cd"] = barcodeArr[i];
				} else if(idx == 3) {
					detail["bill_qt"] = barcodeArr[i];
				} else if(idx == 0) {
					detail["unit_price"] = barcodeArr[i];
				}
			}
		}
		
		// TODO 서버에 쿼리해서 supplier를 찾아 search form에 넣어줘야 함
		// TODO grid에 item_nm, lot_size 등을 넣어줘야 함 
		
		// search form에 데이터 추가 
		var searchForm = this.getSearchForm();
		var formValues = searchForm.getValues();
		formValues.bill_nb = billNb;
		formValues.invoice_no = invoiceNo;
		invoiceDt = Ext.Date.parse(invoiceDate, "Ymd");
		formValues.invoice_date = Ext.Date.format(invoiceDt, 'Y-m-d');
		formValues.po_no = poNo;
		searchForm.setValues(formValues);
		
		// grid에 데이터 추가 
		var gridView = this.getGridView();
		gridView.store.loadRawData(detailList);
	},
	
	/**
	 * Detail Label scan시 
	 */	
	scanDetail : function(barcode) {
		alert(barcode);
	},
	
	/**
	 * Print 버튼 클릭시
	 */
	onPrintLabel : function(view) {
		var billNb = this.getSearchForm().getValues().bill_nb;
		
		if(billNb) {
			// print command 정보를 서버에서 가져온다.
			Ext.Ajax.request({
				url : '/domains/' + login.current_domain_id + '/instocks/' + billNb + '/print.json',
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
		var searchForm = this.getSearchForm();
		searchForm.setValues(params);
		// 이 화면은 조회가 필요없다. Scan시점에 조회한다.
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
		
		return params;
	},
	
	/**
	 * 화면 렌더링 완료 후 마스터 라벨 텍스트에 포커스 
	 */
	onInstockRender : function(view) {
		view.child(' #scan_master').focus();
	},
	
	/**
	 * Reset, New 버튼 클릭시 
	 */
	onResetClick : function(view) {
		var searchView = this.getSearchView();
		searchView.getForm().reset();
		var billDateField = searchView.down(' datefield[name=bill_dt]');
		billDateField.setValue(HF.getCurrentShiftDate());
		
		var gridView = this.getGridView();
		gridView.store.removeAll();
		var subGridView = this.getSubGridView();
		subGridView.store.removeAll();
	},
			
	/****************************************************************
	 ** 			여기서 부터는 abstract method, 필수 구현 				   **
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
		return this.getInstock();
	}
});
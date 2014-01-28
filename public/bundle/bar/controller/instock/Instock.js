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
				after_grid_updated : this.afterGridUpdated
			},
			'bar_instock_sublist' : {
				click_new : this.onResetClick,
				click_save : this.onGridSave
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
		
		labelObj = {
			bill_nb : billNb,
			invoice_no : invoiceNo,
			invoice_date : invoiceDate,
			po_no : poNo,
			bill_dt : billDt,
			details : detailList
		};
		
		Ext.Ajax.request({
			url : '/domains/' + login.current_domain_id + '/instocks/instock_info.json',
			method : 'GET',
			params : { label_info : Ext.JSON.encode(labelObj) },
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
				formValues.tr_cd = result.master.tr_cd;
				searchForm.setValues(formValues);
		
				// grid에 데이터 추가 - item_nm, lot_size, box_qty, ....
				var gridView = this.getGridView();
				gridView.store.loadRawData(result.master.details);				
			},
			scope : this
		});
	},
	
	/**
	 * Detail Label scan시 
	 */	
	scanDetail : function(barcode) {
		var barcodeArr = barcode.split('|');
		var barcodeArrLen = barcodeArr.length;
		var itemSq = barcodeArr[0];
		var itemCd = barcodeArr[1];
		var billQt = barcodeArr[2];
		var unitPrice = barcodeArr[3];
		
		var searchForm = this.getSearchForm();
		var formValues = searchForm.getValues();
		var billNb = formValues.bill_nb;
		var itemBaselocCd = null;
		var itemLocCd = null;
		
		Ext.Ajax.request({
			url : '/domains/' + login.current_domain_id + '/instocks/instock_detail_info.json',
			method : 'GET',
			params : { bill_nb : billNb, item_cd : itemCd, scan_qty : billQt },
			success : function(response) {
				var result = Ext.JSON.decode(response.responseText);
				console.log(result);
				var subGridView = this.getSubGridView();
				var grDetail = result.detail;
				grDetail.barcode_str = barcode;
				// 위 쪽 그리드에서 입력한 baseloc_cd, loc_cd 정보를 가져온다.
				var gridView = this.getGridView();
				
				gridView.store.each(function(record) {
					if(record.data.item_cd == itemCd) {
						grDetail.baseloc_cd = record.data.baseloc_cd;
						grDetail.loc_cd = record.data.loc_cd;
						var oldRealQty = record.get('real_qt');
						var realQty = parseInt(oldRealQty) + parseInt(billQt);
						record.set('real_qt', realQty);
					}
				});
				
				subGridView.store.add(grDetail);				
			},
			scope : this
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
	
	/**
	 * override
	 */
	onGridSave : function(view) {
		HF.msg.confirm({
			msg : T('text.Sure to Save'),
			fn : function(confirmBtn) {
				if(confirmBtn == 'yes') {
					var searchForm = this.getSearchForm();
					var master = searchForm.getValues();
					var details = [];
					view.store.each(function(record) {
						var detail = record.data;
						details.push(detail);
					});
					
					if(details.length > 0) {
						master.details = details;
						var url = this.getMultipleUpdateUrl(view);
						console.log(master)
					    Ext.Ajax.request({
						    url : url,
						    method : 'POST',
						    params : { multiple_data : Ext.JSON.encode(master) },
						    success : function(response) {
								view.fireEvent('after_grid_updated', view, 'c', response);
							}
						});
					} else {
						HF.msg.notice(T('text.Nothing changed'));
					}				
				}
			},
			scope : this
		});
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
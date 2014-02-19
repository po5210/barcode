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
				//var barcode = Ext.String.trim(f.getValue());
				var barcode = f.getValue();
				if(barcode == '' || barcode.length != 530) {					
					HF.msg.notice(T('text.Invalid Invoice'));
				} else {
					barcode = barcode.trim();
					barcode = barcode.toUpperCase();
					this.scanMaster(f, barcode);
					//f.reset();	
					//f.disable();				
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
	scanMaster : function(f, barcode) {
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
			if(i % 4 == 1) {		//HTT363 16012014001|11223|20140116|6QBA-PL-20140116-001|20140116|1|A154LP4AA01|1800|5000|2|A155LP4AA01|1800|8000 
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
		
		invoiceObj = {
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
			params : { invoice_info : Ext.JSON.encode(invoiceObj) },
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
	 * Detail Label scan시 
	 */	
	scanDetail : function(barcode) {
		var barcodeArr = barcode.split('|');
		var barcodeArrLen = barcodeArr.length;
		var billNb = barcodeArr[0];
		var itemCd = barcodeArr[1];
		var itemSerial = barcodeArr[2];
		var scanQty = barcodeArr[3];
		var billDate = barcodeArr[4];

/*		
		var searchForm = this.getSearchForm();
		var formValues = searchForm.getValues();
		var billNb = formValues.bill_nb;
		var itemBaselocCd = null;
		var itemLocCd = null;
*/		
		
		var subGridView = this.getSubGridView();
	    var isFlag = true;
		subGridView.store.each(function(record) {
			if(record.data.item_cd == itemCd && record.data.item_serial==itemSerial ) {
				HF.msg.notice("Exist Label info");
				isFlag = false;;
			}
		});

		if(!isFlag) return;
		
		Ext.Ajax.request({
			url : '/domains/' + login.current_domain_id + '/instocks/instock_detail_info.json',
			method : 'GET',
			params : { bill_nb : billNb, item_cd : itemCd, item_serial : itemSerial, scan_qty : scanQty, bill_date : billDate },
			success : function(response) {
				var result = Ext.JSON.decode(response.responseText);				
				if(result.success){
					
					var grDetail = result.detail;
					grDetail.barcode_str = barcode;
					// 위 쪽 그리드에서 입력한 baseloc_cd, loc_cd 정보를 가져온다.
					var gridView = this.getGridView();
					
					gridView.store.each(function(record) {
						if(record.data.item_cd == itemCd) {
							grDetail.baseloc_cd = record.data.baseloc_cd;
							grDetail.loc_cd = record.data.loc_cd;
							var oldRealQty = record.get('real_qt');
							var realQty = parseInt(oldRealQty) + parseInt(scanQty);
							record.set('real_qt', realQty);
						}
					});
					
					subGridView.store.add(grDetail);				
				}else{
					HF.msg.notice(result.msg);
				}
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
		
		if(!params['in_dt']) {
			params['in_dt'] = HF.getCurrentShiftDate();
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
		var inDateField = searchView.down(' datefield[name=in_dt]');
		inDateField.setValue(HF.getCurrentShiftDate());
		
		var gridView = this.getGridView();
		gridView.store.removeAll();
		var subGridView = this.getSubGridView();
		subGridView.store.removeAll();
		var scanMaster = this.getMainView().child(' #scan_master');
		scanMaster.enable();
		scanMaster.focus();
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
					var instockInfo = searchForm.getValues();
					var masters = [];
					var details = [];
					var isValid = true;
										
					var gridView = this.getGridView();
					gridView.store.each(function(record) {
						var master = record.data;
						
						console.log(master);
						//alert("master.bill_qty["+ master.bill_qty.value +"]");
						//alert("master.bill_qty["+ master.bill_qty +"]master.real_qty["+ master.real_qty +"]");
						if(master.bill_qt != master.real_qt) {							
							isValid = false;
							return;
						} 
						masters.push(master);
					});
					
					if(!isValid) {
						HF.msg.notice(T('text.Error'));
						return;
					}
					
					return false;

					view.store.each(function(record) {
						var detail = record.data;
						details.push(detail);
					});
							
										
					if(masters.length > 0 && details.length > 0) {
						instockInfo.masters = masters;
						instockInfo.details = details;						
						var url =  '/domains/' + login.current_domain_id + '/instocks/update_multiple.json';
					    Ext.Ajax.request({
						    url : url,
						    method : 'POST',
						    //params : { masters : Ext.JSON.encode(masters), details : Ext.JSON.encode(details), invoice : Ext.JSON.encode(invoice) },
						    params : { instockInfo : Ext.JSON.encode(instockInfo) },
						    success : function(response) {
								//view.fireEvent('after_grid_updated', view, 'c', response);
								HF.msg.success(T('text.Success to Save'));
								//this.onResetClick();
//								 this.onResetClick(view);
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
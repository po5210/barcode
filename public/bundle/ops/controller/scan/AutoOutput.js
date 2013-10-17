/**
 * Barcode Scan
 */
Ext.define('Ops.controller.scan.AutoOutput', {
	
	extend : 'Ops.abstract.OpsController',
	
	views : ['Ops.view.scan.AutoOutput'],
	
	refs: [ 
		{ ref : 'MainView', selector : 'ops_scan_auto' },
		{ ref : 'ProdMainView', selector : 'ops_prod_main' }
	],
	
	init : function() {
		this.control({
			'ops_scan_auto' : {
				paramschange : this.onParamsChange,
				afterrender : this.onAfterRender
			},
			'ops_scan_auto #btn_ok' : {
				click : this.onScanLabel
			},
			'ops_scan_auto #label_text' : {
				keydown : this.downLabel
			}
		});
	},
	
	downLabel : function(f, e) {
		if(e.keyCode == 13) {
			this.doActual();
		}
	},
	
	onParamsChange : function(view, params) {
		this.reload(null);
	},
	
	onAfterRender : function() {
		this.getMainView().child(' image').show();
	},
	
	onScanLabel : function(btn, e) {
		this.doActual();
	},
	
	doActual : function() {
		var view = this.getMainView();
		var label = view.child(' #label_text').getValue().toUpperCase();
		
		if(this.checkValidAtClient(label)) {
			//this.checkValidRun(label);
			this.actualOnly(label);
		}
	},
	
	/**
	 * 클라이언트 측 validation check
	 * 날짜 | 공정 코드 | 품목 | Lot No | Serial | 수량 |
	 * 20130605|6PANC|F500MKABA03C|YFE|011|80|
	 */
	checkValidAtClient : function(label) {
		var orderParams = this.getMainView().getParams();
		
		if(label == null || label == '') {
			return false;
		}
		
		var labelArr = label.split('|');
		var lastChar = label[label.length - 1];
		
		// 구분자 '|'는 6자리이어야 하고 마지막은 구분자로 끝나야 함 
		if(labelArr.length != 7 || lastChar != '|') {
			HF.msg.notice(T('text.Invalid Label'));
			return false;
		}
		
		// 첫 번째는 날짜 : 8 자리 
		if(labelArr[0].length != 8) {
			HF.msg.notice(T('text.Invalid Label') + ' : ' + T('label.date'));
			return false;
		}

		// 두 번째는 공정 코드 : 오더의 공정 코드와 일치해야 함 
		if(labelArr[1].length == 0 || labelArr[1] != orderParams.operation) {
			HF.msg.notice(T('text.Invalid Label') + ' : ' + T('text.Mismatch X', {x : T('label.operation')}));
			return false;
		}
		
		// 세 번째는 품목 코드 : 오더의 픔목 코드와 일치 해야 함 
		if(labelArr[2] != orderParams.product) {
			HF.msg.notice(T('text.Invalid Label') + ' : ' + T('text.Mismatch X', {x : T('label.product')}));
			return false;
		}
		
		// 네 번째는 LOT NO : 3 자리 
		if(labelArr[3].length != 3) {
			HF.msg.notice(T('text.Invalid Label') + ' : ' + T('label.lot_no'));
			return false;
		}
		
		// 네 번째는 시리얼 : 3 자리 
		if(labelArr[4].length != 3) {
			HF.msg.notice(T('text.Invalid Label') + ' : ' + T('label.serial_no'));
			return false;
		}
		
		// 다섯번째는 수량 : Integer 형 
		try {
			var qty = parseInt(labelArr[4]);
			// 수량은 0 이하는 허용 안 됨 
			if(!qty || qty < 1) {
				HF.msg.notice(T('text.Invalid Label') + ' : ' + T('label.qty'));
				return false;
			}
		} catch (e) {
			HF.msg.notice(T('text.Invalid Label') + ' : ' + T('label.qty'));
			return false;
		}
		
		return true;
	},
	
	/**
	 * 서버 측 validation 체크 후 실적 처리 ...
	 */
	checkValidRun : function(label_no) {
		var view = this.getMainView();
		var self = this;
		
		// label_no validation check
		Ext.Ajax.request({
			// url : '/domains/' + login.current_domain_id + '/diy_services/CheckValidLot/shoot.json',
			url : '/domains/' + login.current_domain_id + '/ops/validate_lot.json',
			method : 'GET',
			params : {
				prod_order_id : view.getParams().id,
				label_no : label_no
			},
			success : function(response, opts) {
				self.actualOnly(label_no);
			},
		    failure: function(response, opts) {
				var respObj = Ext.decode(response.responseText);
				var msg = respObj.throwable ? respObj.throwable.message : T('title.failure');
				var msgType = respObj.throwable ? respObj.throwable.type : '';
				
				if(msgType == 'Hatio::Exception::ValidationWarning') {
					HF.msg.confirm({
						msg : respObj.throwable.message + ",\n" + T('text.Sure to Going On'),
						fn : function(btn) {
							if(btn == 'yes') {
								self.actualOnly(label_no);
							}
						},
						scope: this
					});
				} else if(msgType == 'Hatio::Exception::InvalidRequest') {
					HF.msg.alert({
						title : T('title.error'),
						msg : respObj.throwable.message
					});
					self.textfieldInit(view.child(' #label_text'));
				} else {
					HF.msg.alert(msg);
				}
		    }
		});
	},
	
	/**
	 * 실적 처리 
	 */
	actualOnly : function(label_no) {
		var view = this.getMainView();
		// input box를 비활성화 시켰다가 ajax 통신이 끝아면 활성화 시킨다. 
		var labelTextfield = view.child(' #label_text');
		labelTextfield.setDisabled(true);
		var self = this;
		
		Ext.Ajax.request({
		    //url : '/domains/' + login.current_domain_id + '/diy_services/OpsDoScan/shoot.json',
			url : '/domains/' + login.current_domain_id + '/ops/scan_lot.json',
		    method : 'POST',
		    params : {
				prod_order_id : view.getParams().id,
				label_no : label_no
			},
		    success: function(response, opts) {
				var obj = Ext.decode(response.responseText);
				self.reload(null, obj.actual_qty);
				var prodMainStore = self.getProdMainView().child('grid').getStore();
				prodMainStore.load();
			},
			failure: function() {
				self.textfieldInit(labelTextfield);
			}
		});
	},
	
	reload : function(label, current_actual_qty) {
		var view = this.getMainView();
		var viewParams = view.getParams();
		
		if(viewParams) {
			view.child(' #operation').setValue(viewParams.operation);
			view.child(' #product').setValue(viewParams.product);
			view.child(' #product_desc').setValue(viewParams.product_desc);
			view.child(' #machine').setValue(viewParams.machine);
			view.child(' #plan').setValue(viewParams.order_qty);
			var actual = view.child(' #actual');
			
			if(current_actual_qty) {
				actual.setValue(current_actual_qty);
			} else {
				actual.setValue(viewParams.actual_qty);
			}
		} else {
			if(current_actual_qty) {
				var actual = view.child(' #actual');
				actual.setValue(current_actual_qty);
			}
		}
		
		this.textfieldInit(view.child(' #label_text'));
	},
	
	textfieldInit : function(textfield) {
		textfield.reset();
		textfield.focus(false, 20);
		textfield.setDisabled(false);
	}
});
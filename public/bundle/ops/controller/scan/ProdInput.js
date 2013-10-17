Ext.define('Ops.controller.scan.ProdInput', {
	
	extend : 'Ops.abstract.OpsController',
	
	views : ['Ops.view.scan.ProdInput'],
	
	refs: [ 
		{ ref : 'MainView', selector : 'ops_scan_prod_input' }
	],
	
	init : function() {
		this.control({
			'ops_scan_prod_input' : {
				paramschange : this.onParamsChange
			},
			'ops_scan_prod_input #btn_ok' : {
				click : this.onLabelInput
			},
			'ops_scan_prod_input #label_text' : {
				keydown : this.downLabel
			}
		});
	},
	
	downLabel : function(f, e) {
		if(e.keyCode == 13) {
			if(f.getValue()) {
				this.scan(f.getValue());
			} else {
				HF.msg.notice(T('text.Invalid Label'));
			}
		}
	},
	
	onParamsChange : function(view, params) {
		this.reload();
	},
	
	onLabelInput : function(btn, e) {
		var view = this.getMainView();
		var labelData = view.child(' #label_text').getValue();
		
		if(labelData && labelData.length > 1) {
			this.scan(labelData);
		} else {
			HF.msg.notice(T('text.Invalid Label'));
		}
	},
	
	scan : function(labelNo) {
		labelNo = labelNo.toUpperCase();
		var prodOrderId = this.getMainView().getParams().id;
		
		if(this.validateAtClient(labelNo)) {
			this.validateAtServer(prodOrderId, labelNo);
		}
	},
	
	validateAtClient : function(label) {
		var orderParams = this.getMainView().getParams();
		
		if(label == null || label == '') {
			return false;
		}
		
		var labelArr = label.split('|');
		var lastChar = label[label.length - 1];
		
		if(labelArr.length != 7 || lastChar != '|') {
			HF.msg.notice(T('text.Invalid Label'));
			return false;
		}
		
		// 첫 번째는 날짜 : 6 자리 
		if(labelArr[0].length != 8) {
			HF.msg.notice(T('text.Invalid Label') + ' : ' + T('label.date'));
			return false;
		}

		// 두 번째는 공정 코드
		if(labelArr[1].length == 0) {
			HF.msg.notice(T('text.Invalid Label') + ' : ' + T('text.Mismatch X', {x : T('label.operation')}));
			return false;
		}
		
		// 세 번째는 품목 코드
		if(labelArr[2].length == 0) {
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
			if(!qty || qty < 0) {
				HF.msg.alert(T('text.Invalid Label') + ' : ' + T('label.qty'));
				return false;
			}
		} catch (e) {
			HF.msg.notice(T('text.Invalid Label') + ' : ' + T('label.qty'));
			return false;
		}
		
		return true;
	},
	
	validateAtServer : function(prodOrderId, labelNo) {
		var self = this;

		// 스캔한 품목이 생산 품목의 BOM 자품목이 맞는지 체크, BOM 자품목 재공이 존재하는지 체크 
		Ext.Ajax.request({
			url : '/domains/' + login.current_domain_id + '/ops/check_prod_input.json',
			method : 'POST',
			params : {
				prod_order_id : prodOrderId,
				label_no : labelNo,
				operation_id : HF.setting.get('option-operation').id
			},
			success : function(response, opts) {
				self.scanProduct(prodOrderId, labelNo);
			},
		    failure: function(response, opts) {
				var respObj = Ext.decode(response.responseText);
				var msg = respObj.throwabel ? respObj.throwable.message : T('title.failure');
				var msgType = respObj.throwable ? respObj.throwable.type : '';
				
				if(msgType == 'Hatio::Exception::ValidationWarning') {
					HF.msg.confirm({
						msg : respObj.throwable.message + ",\n" + T('text.Sure to Going On'),
						fn : function(btn) {
							if(btn == 'yes') {
								self.scanProduct(prodOrderId, labelNo);
							}
						},
						scope: this
					});
				} else if(msgType == 'Hatio::Exception::InvalidRequest') {
					HF.msg.notice({
						title : T('title.error'),
						msg : respObj.throwable.message
					});
				} else {
					HF.msg.notice(msg);
				}
		    }
		});
	},
	
	scanProduct : function(prodOrderId, labelNo) {
		var view = this.getMainView();
		var labelText = view.child(' #label_text');
		labelText.setDisabled(true);
		var self = this;
		
		Ext.Ajax.request({
			url : '/domains/' + login.current_domain_id + '/ops/prod_input.json',
			method : 'POST',
			params : {
				prod_order_id : prodOrderId,
				label_no : labelNo,
				operation_id : HF.setting.get('option-operation').id
			},
			success : function(response, opts) {
				self.textfieldInit(labelText);
			}, 
			failure : function(response) {
				self.textfieldInit(labelText);
			}
		});
	},
	
	reload : function() {
		var view = this.getMainView();
		var viewParams = view.getParams();
		
		if(viewParams) {
			view.child(' #operation').setValue(viewParams.operation);
			view.child(' #machine').setValue(viewParams.machine);
			view.child(' #product').setValue(viewParams.product);
			view.child(' #product_desc').setValue(viewParams.product_desc);
		}
		
		this.textfieldInit(view.child(' #label_text'));
	},
	
	textfieldInit : function(textfield) {
		textfield.reset();
		textfield.focus(false, 20);
		textfield.setDisabled(false);
	}
});

Ext.define('Ops.controller.scan.WipInput', {
	
	extend : 'Ops.abstract.OpsController',
	
	views : ['Ops.view.scan.WipInput'],
	
	refs: [ 
		{ ref : 'MainView', selector : 'ops_scan_wip_input' },
		{ ref : 'ProdMainView', selector : 'ops_prod_main' }
	],
	
	init : function() {
		this.control({
			'ops_scan_wip_input' : {
				paramschange : this.onParamsChange
			},
			'ops_scan_wip_input #btn_ok' : {
				click : this.onScanLabel
			},
			'ops_scan_wip_input #text_label' : {
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
		view.child(' image').show();
		this.textfieldInit(view.child(' #text_label'));
	},
	
	onClickClose : function(view) {
		view.close();
	},
	
	onScanLabel : function(btn, e) {
		this.doWipInput();
	},
	
	doWipInput : function() {
		var view = this.getMainView();
		var label = view.child(' #text_label').getValue().toUpperCase();
		
		if(this.checkValidAtClient(label)) {
			this.inputWip(label);
		}
	},
	
	checkValidAtClient : function(label) {
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

		// 두 번째는 공정 코드 
		if(labelArr[1].length == 0 || labelArr[1] != HF.setting.get('option-operation').name) {
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
			var qty = parseInt(labelArr[5]);
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
	
	inputWip : function(label_no) {
		var view = this.getMainView();
		var prodOrderId = view.getParams().id;
		var labelText = view.child(' #text_label');
		// input box를 비활성화 시켰다가 ajax 통신이 끝아면 활성화 시킨다. 
		labelText.setDisabled(true);
		var self = this;
		
		Ext.Ajax.request({
			url: '/domains/' + login.current_domain_id + '/ops/wip_input.json',
		    method : 'POST',
		    params : { prod_order_id : prodOrderId, label_no : label_no },
		    success : function(response, opts) {
				var obj = Ext.decode(response.responseText);
				self.textfieldInit(labelText);
				HF.msg.success({title : T('title.success'), msg : T('text.Success to Process')});
			},
			failure : function(response) {
				self.textfieldInit(labelText);
			}
		});
	},
	
	textfieldInit : function(text) {
		text.setDisabled(false);
		text.reset();
		text.focus(false, 20);
	}
});
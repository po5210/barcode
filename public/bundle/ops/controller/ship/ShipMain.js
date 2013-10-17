Ext.define('Ops.controller.ship.ShipMain', {
	
	extend : 'Ops.abstract.OpsController',
	
	views : ['Ops.view.ship.ShipMain'],
	
	requires : [ 'Ops.abstract.OpsController' ],
	
	refs: [ { ref : 'MainView', selector : 'ops_ship_main' } ],
	
	status : 'W',
	
	customerId : '',
	
	productId : '',
	
	init : function() {
		this.control({
			'ops_ship_main' : {
				paramschange : this.onParamsChange
			},
			'ops_ship_main #scan_lot' : {
				keydown : this.onScanLot
			},
			'ops_ship_main #btn_ok' : {
				click : this.processLot
			},
			'ops_ship_main #btn_new_shipping' : {
				click : this.onNewShipping
			},
			'ops_ship_main #btn_finish_shipping' : {
				click : this.onFinishShipping
			},
			'ops_ship_main #btn_abort_shipping' : {
				click : this.onAbortShipping
			}
		});
	},
	
	/**
	 * 화면 진입시 
	 */
	onParamsChange : function(view, params) {
		if(!HF.setting.get('option-operation')) {
			var field = Ext.getCmp('optionbar').down('field[name=option-operation]');
			HF.msg.tip(T('text.Select x First', {x : T('label.operation')}), field);
			return;
		}
	},
	
	/**
	 * 상태 설정 
	 */
	setStatus : function(status) {
		this.status = status;
		var view = this.getMainView();
		var gridDataSize = view.child(' #leftgrid').store.getTotalCount();
		gridDataSize += view.child(' #rightgrid').store.getTotalCount();
		
		if(status == 'W') {
			view.child(' #scan_lot').setDisabled(true);
			view.child(' #btn_new_shipping').setDisabled(false);
			view.child(' #btn_abort_shipping').setDisabled(true);
			view.child(' #btn_finish_shipping').setDisabled(true);
			view.child(' #btn_reprint').setDisabled(true);
		} else if(status == 'R') {
			view.child(' #scan_lot').setDisabled(false);
			view.child(' #btn_new_shipping').setDisabled(true);
			if(gridDataSize > 0) {
				view.child(' #btn_abort_shipping').setDisabled(false);
				view.child(' #btn_finish_shipping').setDisabled(false);	
			} else {
				view.child(' #btn_abort_shipping').setDisabled(true);
				view.child(' #btn_finish_shipping').setDisabled(true);				
			}
			view.child(' #btn_reprint').setDisabled(true);
		} else if(status == 'T') {
			view.child(' #scan_lot').setDisabled(true);
			view.child(' #btn_new_shipping').setDisabled(false);
			view.child(' #btn_abort_shipping').setDisabled(true);
			view.child(' #btn_finish_shipping').setDisabled(true);
			view.child(' #btn_reprint').setDisabled(false);
		}
	},
	
	/**
	 * Shipping 시작 
	 */
	onNewShipping : function() {
		var view = this.getMainView();
		var currentCustomer = view.child(' #current_customer').items.items[0].getValue();
		var currentProduct = view.child(' #current_product').items.items[0].getValue();
				
		if(!currentCustomer || currentCustomer == '') {
			HF.msg.notice(T('text.Select x First', {x : T('title.customer')}));
			return;
		}
		
		if(!currentProduct || currentProduct == '') {
			HF.msg.notice(T('text.Select x First', {x : T('label.product')}));
			return;
		}
		
		this.customerId = login.current_domain_id + '-' + currentCustomer;
		this.productId = login.current_domain_id + '-' + currentProduct;
		
		var self = this;
		var view = this.getMainView();
		Ext.Ajax.request({
		    url: '/domains/' + login.current_domain_id + '/shipping_lots/start_shipping.json',
		    method : 'POST',
		    params : { 
				customer_id : self.customerId,
				product_id : self.productId
			},
		    success: function(response, opts) {
				var results = Ext.decode(response.responseText);
				view.child(' #scan_lot').reset();
				view.child(' #scan_lot').focus(false, 20);
				view.child(' #leftgrid').store.loadRawData(results.left_containers);
				view.child(' #rightgrid').store.loadRawData(results.right_containers);
				self.setStatus('R');
			},
			failure: function() {
				view.child(' #scan_lot').setValue("");
			}
		});
	},
	
	/**
	 * Shipping 종료 
	 */
	onFinishShipping : function() {
		HF.msg.confirm({
			//msg : T('text.Sure to Finish'),
			msg : 'Are you sure to finish?',
			fn : function(btn) {
				if(btn != 'yes')
					return;
					
				this.finishShipping();
			},
			scope: this
		});
	},
	
	/**
	 * Shipping 중지 
	 */
	onAbortShipping : function() {
		HF.msg.confirm({
			//msg : T('text.Sure to Cancel'),
			msg : 'Are you sure to abort?',
			fn : function(btn) {
				if(btn != 'yes')
					return;
					
				this.cancelShipping();
			},
			scope: this
		});
	},
	
	/**
	 * Scan
	 */
	onScanLot : function() {
		if(e.keyCode == 13) {
			this.processLot();
		}
	},
	
	/**
	 * Lot 처리 
	 */
	processLot : function() {
		var view = this.getMainView();
		var label = view.child(' #scan_lot').getValue().toUpperCase();
		var valid = this.checkValidAtClient(label);
		if(!valid) {
			return;
		}
		
		this.shippingLot(label);
	},
	
	/**
	 * 클라이언트 측 validation check
	 * 날짜 - 공정코드 - 품목 - Serial
	 * 20130605-6PANC-F500MKABA03C-011
	 */
	checkValidAtClient : function(label) {
		
		if(this.status != 'R') {
			HF.msg.notice(T('text.Select x First', {x : T('button.new_shipping')}));
			return false;
		}
		
		if(label == null || label == '') {
			return false;
		}
		
		var labelArr = label.split('-');
		if(labelArr.length != 4) {
			HF.msg.notice(T('text.Invalid Label'));
			return false;
		}
		
		// 첫 번째는 날짜 : 8 자리 
		if(labelArr[0].length != 8) {
			HF.msg.notice(T('text.Invalid Label') + ' : ' + T('label.date'));
			return false;
		}

		// 세 번째는 품목 코드 : 선택한 품목과 일치해야 함 
		if((login.current_domain_id + '-' + labelArr[2]) != this.productId) {
			HF.msg.notice(T('text.Invalid Label') + ' : ' + T('text.Mismatch X', {x : T('label.product')}));
			return false;
		}
		
		// 네 번째는 시리얼 : 3 자리 
		if(labelArr[3].length != 3) {
			HF.msg.notice(T('text.Invalid Label') + ' : ' + T('label.serial_no'));
			return false;
		}
		
		return true;
	},
	
	/**
	 * Shipping 처리 
	 */
	shippingLot : function(label) {
		var self = this;
		var view = this.getMainView();
		Ext.Ajax.request({
		    url: '/domains/' + login.current_domain_id + '/shipping_lots/validate_shipping.json',
		    method : 'POST',
		    params : { 
				customer_id : self.customerId,
				product_id : self.productId,
				label : label 
			},
		    success: function(response, opts) {
				var results = Ext.decode(response.responseText);
				view.child(' #scan_lot').reset();
				view.child(' #scan_lot').focus(false, 20);
				view.child(' #leftgrid').store.loadRawData(results.left_containers);
				view.child(' #rightgrid').store.loadRawData(results.right_containers);
				self.setStatus('R');
			},
			failure: function() {
				view.child(' #scan_lot').setValue("");
			}
		});
	},
	
	/**
	 * Shipping 취소  
	 */
	cancelShipping : function() {
		var self = this;
		var view = this.getMainView();
		Ext.Ajax.request({
		    url: '/domains/' + login.current_domain_id + '/shipping_lots/abort_shipping.json',
		    method : 'POST',
		    params : { 
				customer_id : self.customerId,
				product_id : self.productId
			},
		    success: function(response, opts) {
				var results = Ext.decode(response.responseText);
				view.child(' #scan_lot').reset();
				view.child(' #leftgrid').store.loadRawData(results.left_containers);
				view.child(' #rightgrid').store.loadRawData(results.right_containers);
				self.setStatus('W');
			},
			failure: function() {
			}
		});
	},
	
	/**
	 * Shipping 완료
	 */
	finishShipping : function() {
		var self = this;
		var view = this.getMainView();
		Ext.Ajax.request({
		    url: '/domains/' + login.current_domain_id + '/shipping_lots/finish_shipping.json',
		    method : 'POST',
		    params : { 
				work_date : WORK_DATE,
				shift : SHIFT,
				customer_id : self.customerId,
				product_id : self.productId
			},
		    success: function(response, opts) {
				var results = Ext.decode(response.responseText);
				view.child(' #scan_lot').reset();
				view.child(' #leftgrid').store.loadRawData(results.left_containers);
				view.child(' #rightgrid').store.loadRawData(results.right_containers);
				self.setStatus('T');
			},
			failure: function() {
			}
		});
	}
});
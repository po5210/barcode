Ext.define('Ops.controller.pack.PackingMain', {
	
	extend : 'Ops.abstract.OpsController',
	
	views : ['Ops.view.pack.PackingMain'],
	
	requires : [ 
		'Ops.abstract.OpsController', 
	],
	
	refs: [ { 
		ref : 'MainView', selector : 'ops_packing_main' 
	} ],
	
	labelMaster : null,
	
	totalInShift : 0,
	
	totalRackCount : 0,
		
	currentProdCount : 0,
	
	status : 'W',
	
	init : function() {
		this.control({
			'ops_packing_main' : {
				paramschange : this.onParamsChange,
				keydown : this.onScanLot
			},
			'ops_packing_main #scan_lot' : {
				keydown : this.onScanLot
			},
			'ops_packing_main #btn_ok' : {
				click : this.processPacking
			},
			'ops_packing_main #btn_new_rack' : {
				click : this.onNewRack
			},
			'ops_packing_main #btn_finish_rack' : {
				click : this.onFinishRack
			},
			'ops_packing_main #btn_abort_rack' : {
				click : this.onAbortRack
			},
			'ops_packing_main #btn_reprint' : {
				click : this.onReprint
			},
			'ops_packing_main #btn_current_rack' : {
				click : this.onNewRack
			},
			'ops_packing_main #btn_print_setting' : {
				click : this.onPrintSetting
			},
			'ops_packing_main #leftgrid' : {
				itemclick : this.onLotListClick
			}
		});
	},

	setLabelMaster : function(labelMaster) {
		this.labelMaster = labelMaster;
	},
	
	setTotalInShift : function(totalInShift) {
		this.totalInShift = totalInShift;
		var view = this.getMainView();
		view.child(' #total_in_shift').setValue(this.totalInShift);
	},
	
	setRackCount : function(totalRackCount) {
		this.totalRackCount = totalRackCount;
		var view = this.getMainView();
		view.child(' #rack_pack').setValue(this.totalRackCount);
	},
		
	setCurrentProdCount : function(currentProdCount) {
		this.currentProdCount = currentProdCount;
		var view = this.getMainView();
		view.child(' #current_count').setValue(this.currentProdCount);
	},
	
	setStatus : function(status) {
		this.status = status;
		var view = this.getMainView();
		var gridDataSize = view.child(' #rightgrid').store.getTotalCount();
		
		if(status == 'W') {
			view.child(' #scan_lot').setDisabled(true);
			view.child(' #btn_ok').setDisabled(true);
			view.child(' #btn_new_rack').setDisabled(false);
			view.child(' #btn_current_rack').setDisabled(true);
			view.child(' #btn_abort_rack').setDisabled(true);
			view.child(' #btn_finish_rack').setDisabled(true);
			view.child(' #btn_reprint').setDisabled(true);
			
		} else if(status == 'R') {
			view.child(' #scan_lot').setDisabled(false);
			view.child(' #btn_ok').setDisabled(false);
			view.child(' #btn_current_rack').setDisabled(true);
			view.child(' #btn_new_rack').setDisabled(true);
			if(gridDataSize > 0) {
				view.child(' #btn_abort_rack').setDisabled(false);
				view.child(' #btn_finish_rack').setDisabled(false);	
			} else {
				view.child(' #btn_abort_rack').setDisabled(true);
				view.child(' #btn_finish_rack').setDisabled(true);
			}
			view.child(' #btn_reprint').setDisabled(true);
			
		} else if(status == 'T') {
			view.child(' #scan_lot').setDisabled(true);
			view.child(' #btn_ok').setDisabled(true);
			view.child(' #btn_new_rack').setDisabled(false);
			view.child(' #btn_current_rack').setDisabled(true);
			view.child(' #btn_abort_rack').setDisabled(true);
			view.child(' #btn_finish_rack').setDisabled(true);
			view.child(' #btn_reprint').setDisabled(false);
		}
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
	 * New Rack
	 */
	onNewRack : function() {
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
		
		Ext.Ajax.request({
		    url: '/domains/' + login.current_domain_id + '/packings/start_packing.json',
		    method : 'POST',
		    params : { 
				work_date : WORK_DATE,
				shift : SHIFT,
				operation_id : HF.setting.get('option-operation').id,
				customer_id : login.current_domain_id + '-' + currentCustomer,
				product_id : login.current_domain_id + '-' + currentProduct
			},
		    success: function(response, opts) {
				var results = Ext.decode(response.responseText);
				view.child(' #scan_lot').reset();
				this.setLabelMaster(results.label_master);
				view.child(' #leftgrid').store.loadRawData(results.packings);
				view.child(' #rightgrid').store.loadRawData(results.packing_lots);
				this.setCurrentProdCount(results.packing_lots.length);
				this.setRackCount(results.packings.length);
				this.setTotalInShift(results.total_pack_qty);
				this.setStatus('R');
			},
			failure: function(response) {
			},
			scope : this
		});
	},
	
	/**
	 * Finish Rack
	 */
	onFinishRack : function() {
		HF.msg.confirm({
			msg : T('text.Sure to X', {x : T('button.finish')}),
			fn : function(btn) {
				if(btn != 'yes')
					return;
					
				this.finishPacking();
			},
			scope: this
		});
	},
	
	/**
	 * Abort Rack
	 */
	onAbortRack : function() {
		HF.msg.confirm({
			msg : T('text.Sure to X', {x : T('button.abort')}),
			fn : function(btn) {
				if(btn != 'yes')
					return;
					
				this.cancelPacking();
			},
			scope: this
		});
	},
	
	/**
	 * Scan Lot
	 */
	onScanLot : function(f, e) {
		if(e.keyCode == 13) {
			this.processPacking();
		}
	},
	
	/**
	 * 패킹 처리 
	 */
	processPacking : function() {
		var view = this.getMainView();
		if(!label && label != '') {
			var label = view.child(' #scan_lot').getValue().toUpperCase();
			var valid = this.checkValidAtClient(label);
			if(valid) {
				this.packingLot(label);
			}
		}
	},
	
	/**
	 * 클라이언트 측 validation check
	 * 품목 코드 확인 
	 */
	checkValidAtClient : function(label) {
		if(!label || label == '') {
			HF.msg.notice(T('text.Empty Label'));
			return false;			
		}
		
		if((login.current_domain_id + '-' + label) != this.labelMaster.product_id) {
			HF.msg.notice(T('text.Invalid Label') + ' : ' + T('text.Mismatch X', {x : T('label.product')}));
			return false;
		}
		
		return true;
	},
	
	/**
	 * Lot Scan시 로트를 패킹 
	 */
	packingLot : function(label) {
		var view = this.getMainView();
		// input box를 비활성화 시켰다가 ajax 통신이 끝아면 활성화 시킨다.
		var scanText = view.child(' #scan_lot');
		scanText.setDisabled(true);
				
		Ext.Ajax.request({
		    url: '/domains/' + login.current_domain_id + '/packings/packing_lot.json',
		    method : 'POST',
		    params : { 
				work_date : WORK_DATE,
				shift : SHIFT,
				operation_id : HF.setting.get('option-operation').id,
				customer_id : this.labelMaster.customer_id,
				product_id : this.labelMaster.product_id
			},
		    success: function(response, opts) {
				var results = Ext.decode(response.responseText);
				this.setCurrentProdCount(results.packing_lots.length);
				view.child(' #rightgrid').store.loadRawData(results.packing_lots);
				this.setStatus('R');
				
				if(this.currentProdCount == this.labelMaster.pallet_qty) {
					this.finishPacking();
					this.onNewRack();
				} else {
					scanText.reset();
					scanText.focus(false, 20);
					scanText.setDisabled(false);
				}
			},
			failure: function(response) {
				scanText.reset();
				scanText.focus(false, 20);
				scanText.setDisabled(false);
			},
			scope : this
		});
	},
	
	/**
	 * 로트 패킹 완료 - Container Lot 생성 
	 */
	finishPacking : function() {
		var view = this.getMainView();
		Ext.Ajax.request({
		    url: '/domains/' + login.current_domain_id + '/packings/finish_packing.json',
		    method : 'POST',
		    params : { 
				work_date : WORK_DATE,
				shift : SHIFT,
				operation_id : HF.setting.get('option-operation').id,
				customer_id : this.labelMaster.customer_id,
				product_id : this.labelMaster.product_id
			},
		    success: function(response, opts) {
				var results = Ext.decode(response.responseText);
				this.setRackCount(results.packings.length);
				this.setTotalInShift(results.total_pack_qty);
				view.child(' #leftgrid').store.loadRawData(results.packings);
				view.child(' #rightgrid').store.loadRawData(results.packing_lots);
				this.setStatus('T');
				view.child(' #scan_lot').reset();
				this.printPackingLabel(results.current_packing_id);
			},
			failure: function(response) {
			},
			scope : this
		});
	},
	
	/**
	 * 패킹 취소
	 */
	cancelPacking : function() {
		var view = this.getMainView();
		Ext.Ajax.request({
		    url : '/domains/' + login.current_domain_id + '/packings/abort_packing.json',
		    method : 'POST',
		    params : { 
				work_date : WORK_DATE,
				shift : SHIFT,
				operation_id : HF.setting.get('option-operation').id,
				customer_id : this.labelMaster.customer_id,
				product_id : this.labelMaster.product_id
			},
		    success : function(response, opts) {
				var results = Ext.decode(response.responseText);
				view.child(' #scan_lot').reset();
				this.setCurrentProdCount(results.packing_lots.length);
				view.child(' #rightgrid').store.loadRawData(results.packing_lots);
				this.setStatus('W');
			},
			failure : function(response) {
			},
			scope : this
		});
	},
	
	/**
	 * lot list click
	 */
	onLotListClick : function(grid, record, item, index, e, eOpts) {
		var packingId = record.get('id');
		var view = this.getMainView();
		
		Ext.Ajax.request({
		    url: '/domains/' + login.current_domain_id + '/packings/get_packing_lots.json',
			params : { 'packing_id' : packingId },
		    method : 'GET',
		    success: function(response, opts) {
				var results = Ext.decode(response.responseText);
				view.child(' #rightgrid').store.loadRawData(results);
				view.child(' #scan_lot').setDisabled(true);
				view.child(' #btn_ok').setDisabled(true);
				view.child(' #btn_new_rack').setDisabled(true);
				view.child(' #btn_current_rack').setDisabled(false);
				view.child(' #btn_abort_rack').setDisabled(true);
				view.child(' #btn_finish_rack').setDisabled(true);
				view.child(' #btn_reprint').setDisabled(false);
			},
			failure: function(response) {
			}
		});
	},
	
	/**
	 * Reprint Button Click 
	 */
	onReprint : function() {
		var packingGrid = this.getMainView().child(' #leftgrid');
		var selectionModel = packingGrid.getSelectionModel();
		var packings = selectionModel.getSelection();
		var packing = (packings && packings.length > 0) ? packings[0].data : null;
		if(packing && packing.id) {
			this.printPackingLabel(packing.id);
		}
	},
	
	/**
	 * Print Packing Label
	 */
	printPackingLabel : function(requestPrint) {
		var wsState = HF.agent.state();
		if(wsState != 'open') {
			this.connectWs(requestPrint);
		} else {
			this.requestPrint(requestPrint);
		}
	},
	
	/**
	 * WebSocket reconnect
	 */
	connectWs : function(packingId) {
		var self = this;
		HF.agent.connect();
		HF.agent.on('open', function(url) {
			self.requestPrint(packingId);
		});
		HF.agent.on('error', function(error) {
			HF.msg.failure('Connection Error (' + error + ')');
		});
		HF.agent.on('close', function(url, evtCode, evtReason) {
			HF.msg.notice('Connection Closed!');
		});
	},
	
	/**
	 * Requet Label Print To Print Agent
	 */
	requestPrint : function(packingId) {
		Ext.Ajax.request({
			url : '/domains/' + login.current_domain_id + '/packings/label_command.json',
			params : { packing_id : packingId },
			method : 'GET',
			success : function(response) {
				var result = Ext.JSON.decode(response.responseText);
				if(result.success) {
					var message = { "labelPlanId" : packingId, "msgType" : "PRINT", "msg" : result.command };
					HF.agent.request(message, function(response) {
						if(response.success) {
							HF.msg.success(T('title.success'));
						} else {
							HF.msg.failure(response.msg + ' (' + response.details + ')');
						}
					}, this);
				} else {
					HF.msg.failure(response.responseText);
				}
			},
			scope : this
		});	
	},
	
	/**
	 * 바코드 프린트 세팅
	 */
	onPrintSetting : function() {
		HF.popup('Ops.view.prt.PrintSetting', {}, {});
	}
});
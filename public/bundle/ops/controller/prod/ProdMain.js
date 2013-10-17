Ext.define('Ops.controller.prod.ProdMain', {
	
	extend : 'Ops.abstract.OpsController',
	
	views : ['Ops.view.prod.ProdMain'],
	
	requires : [ 'Ops.abstract.OpsController' ],
	
	refs: [ { ref : 'MainView', selector : 'ops_prod_main' } ],
	
	init : function() {
		this.control({
			'ops_prod_main' : {
				paramschange : this.onParamsChange,
				afterJobStart : this.afterJobStart,
			},
			'ops_prod_main grid' : {
				itemdblclick : this.onDblClick
			},
			// Menu Show / Hide
			'ops_prod_main #btn_show_hide' : {
				click : this.onShowHideMenu
			},
			// Move Up
			'ops_prod_main #btn_up' : {
				click : this.onScrollUp
			},
			// Move Down
			'ops_prod_main #btn_down' : {
				click : this.onScrollDown
			},
			// Production Status
			'ops_prod_main #status' : {
				click : this.onStatusClick
			},
			// Modify Operator Button
			'ops_prod_main #btn_modify_operator' : {
				click : this.onModifyOperator
			},
			// Add Plan Button
			'ops_prod_main #btn_add_plan' : {
				click : this.onAddPlan
			},
			// Add Scrap Button
			'ops_prod_main #btn_scrap' : {
				click : this.onAddScrap
			},
			// LineStop Button
			'ops_prod_main #btn_line_stop' : {
				click : this.onLineStop
			},
			// Mold Breakdown Button
			'ops_prod_main #btn_mold_breakdown' : {
				click : this.onMoldStop
			},
			// Manual Output Button
			'ops_prod_main #btn_manual_output' : {
				click : this.onManualOutput
			},
			// Manual Multiple Output Button
			'ops_prod_main #btn_multi_manual_output' : {
				click : this.onMultiManualOutput
			},
			// Scan Button
			'ops_prod_main #scan' : {
				click : this.onScan
			},
			// Prod. Report Button
			'ops_prod_main #btn_prod_list' : {
				click : this.onProdList
			},
			// Prod. Input Button
			'ops_prod_main #btn_prod_input' : {
				click : this.onProdInput
			},
			// Request Material Button
			'ops_prod_main #btn_req_mat' : {
				click : this.onRequestMaterial
			},
			// Wip Input Button
			'ops_prod_main #btn_wip_input' : {
				click : this.onWipInput
			}
		});
		
		HF.setting.on('option-operation_info', this.onOperationChange, this);
		HF.setting.on('setting-folding_sidebar', this.onFoldingChange, this);
	},
	
	/**
	 * Operation 선택이 변경되었을 경우 공정 속성에 따라 특정 버튼을 숨기거나 활성화 한다.
	 */
	onOperationChange : function() {
		var view = this.getMainView();
		var grid = view.child('grid');
		var opInfo = HF.setting.get('option-operation_info');
		// TODO 버튼을 숨기거나 뺀다.
	},
	
	/**
	 * Folding side bar 변경시 
	 */
	onFoldingChange : function() {
		var folding = HF.setting.get('setting-folding_sidebar');
		var showHideMenu = this.getMainView().child(' #btn_show_hide');
		if(showHideMenu) {
			if(folding) {
				showHideMenu.setText(T('button.show'));
				Ext.getCmp('navbar').hide();
			} else {
				showHideMenu.setText(T('button.hide'));
				Ext.getCmp('navbar').show();
			}
		}
	},

	/**
	 * Show or Hide Menu
	 */
	onShowHideMenu : function(btn) {
		HF.setting.set('setting-folding_sidebar', !HF.setting.get('setting-folding_sidebar'));
	},
		
	/**
	 * Scroll Up
	 */
	onScrollUp : function() {
		var grid = this.getMainGrid();
		grid.scrollByDeltaY(-100);
	},
	
	/**
	 * Scroll Down
	 */
	onScrollDown : function() {
		var grid = this.getMainGrid();
		grid.scrollByDeltaY(100);
	},
	
	/**
	 * 그리드 Double Click시 
	 */
	onDblClick : function(grid, record, item, index, e, eOpts) {
		var order = this.getSelectedOrder();
		HF.popup('Ops.view.prod.JobInfo', order, {});
	},
	
	/**
	 * 화면 진입시 
	 */
	onParamsChange : function(view, params) {
		var showMenu = !HF.setting.get('setting-folding_sidebar');
		var showHideMenu = view.child(' #btn_show_hide');
		if(showHideMenu) {
			showHideMenu.setText(showMenu ? T('button.hide') : T('button.show'));
		}
		
		if(!HF.setting.get('option-operation')) {
			var field = Ext.getCmp('optionbar').down('field[name=option-operation]');
			HF.msg.tip(T('text.Select x First', {x : T('label.operation')}), field);
			return;
		}
		
		this.onOperationChange();
		
		var grid = view.child('grid');
		var store = grid.getStore();
		if(params) {
			store.getProxy().extraParams = params;
			grid.getStore().load();
		} else {
			store.getProxy().extraParams = {
				operation_id : HF.setting.get('option-operation').id,
				work_date : HF.setting.get('option-work_date'),
				shift : HF.setting.get('option-shift')
			};
			grid.getStore().load();
		}
	},
	
	/**
	 * Prod. List 버튼 클릭시 
	 */
	onProdList : function(grid, item, rowIndex, colIndex, e, record) {
		var order = this.getSelectedOrder();
		if(order) {
			HF.show('Ops.view.prod.ProdList', order, null);
		} else {
			HF.msg.notice({title : T('text.Nothing selected'), msg : T('text.Select x First', {x : T('label.job')})});
		}
	},
	
	/**
	 * 바코드 스캔 버튼 클릭시 
	 */
	onScan : function(grid, item, rowIndex, colIndex, e, record) {
		if(record.data.status == 'R') {
			HF.popup('Ops.view.scan.AutoOutput', record.data, null);
		}
	},
	
	/**
	 * 상태 버튼 클릭시
	 */
	onStatusClick : function(view, rowIndex, colIndex, item, e, record) {
		var gridStore = this.getMainGrid().getStore();
		// 작업 개시 
		if(record.data.status != 'R') {
			HF.popup('Ops.view.prod.JobStart', record.data, null);
		// 작업 종료 
		} else {
			HF.msg.confirm({
				msg : T('text.Sure to Finish'),
				fn : function(btn) {
					if(btn == 'yes') {
						Ext.Ajax.request({
							//url : '/domains/' + login.current_domain_id + '/diy_services/OpsEndOrder/shoot.json',
							url : '/domains/' + login.current_domain_id + '/ops/end_order.json',
							method : 'POST',
							params : { prod_order_id : record.data.id },
						    success: function(response, opts) {
								gridStore.load();
							}
						});
					}
				},
				scope: this
			});
		}
	},
	
	/**
	 * 작업자 작업시간 정보 저장 후 작업 시작
	 */
	afterJobStart : function(record) {
		var mainStore = this.getMainGrid().getStore();
		mainStore.load();
	},
	
	/**
	 * 계획 추가 버튼 클릭시 
	 */
	onAddPlan : function() {
		if(HF.setting.get('option-operation')) {
			HF.popup('Ops.view.prod.AddPlan', {}, {});
		}
	},
	
	/**
	 * Modify Operator 버튼 클릭시 
	 */
	onModifyOperator : function(grid, item, rowIndex, colIndex, e, record) {
		var order = this.getSelectedOrder();
		if(order) {
			if(order.status == 'W') {
				HF.msg.notice(T('text.Modify Operator Not Allowed'));
			} else {
				order.popup_mode = 'manual';
				HF.popup('Ops.view.prod.ModifyOperator', order, null);
			}
		} else {
			HF.msg.notice({title : T('text.Nothing selected'), msg : T('text.Select x First', {x : T('label.job')})});
		}
	},
	
	/**
	 * Add Scrap 버튼 클릭시 
	 */
	onAddScrap : function() {
		var order = this.getSelectedOrder();
		if(order) {
			HF.popup('Ops.view.prod.AddScrap', order, null);
		} else {
			HF.msg.notice({title : T('text.Nothing selected'), msg : T('text.Select x First', {x : T('label.job')})});
		}
	},
	
	/**
	 * LineStop 버튼 클릭시 
	 */
	onLineStop : function() {
		var order = this.getSelectedOrder();
		var gridStore = this.getMainGrid().getStore();
		var prod_order_ids = null;
		var prod_data = null;
		
		for(i = 0 ; i < gridStore.data.items.length ; i++) {
			var record = gridStore.data.items[i];
			if(record.status == 'R') {
				prod_order_ids = record.id;
				prod_data = record.data;
			}
		}

		if(order) {
			HF.popup('Ops.view.stop.StopReport', order, null);
		} else if(prod_order_ids && prod_data) {
			HF.popup('Ops.view.stop.StopReport', prod_data, null);
		} else {
			HF.msg.notice({title : T('text.Nothing selected'), msg : T('text.Select x First', {x : T('label.job')})});
		}
	},
	
	/**
	 * Mold Stop 버튼 클릭시 
	 */
	onMoldStop : function() {
		var order = this.getSelectedOrder();
		var gridStore = this.getMainGrid().getStore();
		var prod_order_ids = null;
		var prod_data = null;
		
		for(i = 0 ; i < gridStore.data.items.length ; i++) {
			var record = gridStore.data.items[i];
			if(record.status == 'R') {
				prod_order_ids = record.id;
				prod_data = record.data;
			}
		}

		if(order) {
			HF.popup('Ops.view.mold.MoldReport', order, null);
		} else if(prod_order_ids && prod_data) {
			HF.popup('Ops.view.mold.MoldReport', prod_data, null);
		} else {
			HF.msg.notice({title : T('text.Nothing selected'), msg : T('text.Select x First', {x : T('label.job')})});
		}
	},
	
	/**
	 * Multiple Manual Output 버튼 클릭시 
	 */	
	onMultiManualOutput : function() {
		if(HF.setting.get('option-operation')) {
			var mainGrid = this.getMainGrid();
			var records = [];
			mainGrid.store.each(function(record) {
				records.push(record.data);
			});
			HF.popup('Ops.view.scan.MultiManualOutput', records, {});
		}
	},
	
	/**
	 * Manual Output 버튼 클릭시 
	 */
	onManualOutput : function() {
		var order = this.getSelectedOrder();
		if(order) {
			HF.popup('Ops.view.scan.ManualOutput', order, null);
		} else {
			HF.msg.notice({title : T('text.Nothing selected'), msg : T('text.Select x First', {x : T('label.job')})});
		}
	},
	
	/**
	 * Prod. Input 버튼 클릭시 
	 */
	onProdInput : function() {
		var order = this.getSelectedOrder();
		if(order) {
			HF.popup('Ops.view.scan.ProdInput', order, null);
		} else {
			HF.msg.notice({title : T('text.Nothing selected'), msg : T('text.Select x First', {x : T('label.job')})});
		}
	},
	
	/**
	 * Prod. Input 버튼 클릭시 
	 */
	onRequestMaterial : function() {
		var order = this.getSelectedOrder();
		if(order) {
			HF.popup('Ops.view.prod.RequestMaterial', order, null);
		} else {
			HF.msg.notice({title : T('text.Nothing selected'), msg : T('text.Select x First', {x : T('label.job')})});
		}
	},
	
	/**
	 * Wip Input 버튼 클릭시 
	 */
	onWipInput : function() {
		var order = this.getSelectedOrder();
		if(order) {
			HF.popup('Ops.view.scan.WipInput', order, null);
		} else {
			HF.msg.notice({title : T('text.Nothing selected'), msg : T('text.Select x First', {x : T('label.job')})});
		}
	},
	
	/**
	 * 현재 선택된 오더를 리턴한다. 
	 */
	getSelectedOrder : function() {
		var view = this.getMainView();
		var selectionModel = view.child('grid').getSelectionModel();
		var orders = selectionModel.getSelection();
		return (orders && orders.length > 0) ? orders[0].data : null;
	},
	
	/**
	 * Order List Grid를 리턴 
	 */
	getMainGrid : function() {
		return this.getMainView().child('grid');
	}
});
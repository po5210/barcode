/**
 * Job Start
 */
Ext.define('Ops.controller.prod.JobStart', {
	
	extend : 'Ops.abstract.OpsController',
	
	views : ['Ops.view.prod.JobStart'],
	
	refs: [
		{ ref : 'JobStart', selector : 'ops_prod_start' },
		{ ref : 'MainView', selector : 'ops_prod_main' }
	],
	
	init : function() {
		this.control({
			'ops_prod_start' : {
				paramschange : this.onParamsChange,
				click_save : this.onClickSave,
				click_close : this.onClickClose,
				click_add : this.onGridAdd,
				click_moveup : this.onClickUp,
				click_movedown : this.onClickDown,
				click_check_all : this.onCheckAll
			},
			'ops_prod_start #status' : {
				click : this.onStatusClick
			},
		});
	},
	
	onParamsChange : function(view, params) {
		view.child(' #date').setValue(HF.setting.get('option-work_date_disp'));
		view.child(' #shift').setValue(SHIFT_NAME);
		view.child(' #operation').setValue(params.operation);
		view.child(' #machine').setValue(params.machine);
		
		var gridStore = view.child('grid').getStore();
		gridStore.getProxy().extraParams = { prod_order_id : params.id };

		// 기존에 등록된 작업자는 변경하지 못하고 추가만 가능하다.
		view.child('grid').on('beforeedit', function(editor, e, eOpts) {
			var type = e.record.get('type');
			if(type && type == 'new' && e.colIdx == 1) {
				return true;
			} else {
				return false;
			}
		});

		gridStore.load();
	},
	
	/**
	 * 상태 버튼 클릭시 
	 */
	onStatusClick : function(view, rowIndex, colIndex, item, e, record) {
		if(!record.data.status || record.data.status == '') {
			record.set('status', 'Y');
		} else if(record.data.status == 'Y') {
			record.set('status', '');
		}
	},
	
	/**
	 * Move Up 버튼 클릭시 
	 */
	onClickUp : function() {
		var grid = this.getJobStart().child('grid');
		grid.scrollByDeltaY(-100);
	},
	
	/**
	 * Move Down 버튼 클릭시 
	 */
	onClickDown : function() {
		var grid = this.getJobStart().child('grid');
		grid.scrollByDeltaY(100);
	},
	
	/**
	 * Check All 버튼 클릭시 
	 */
	onCheckAll : function() {
		var grid = this.getJobStart().child('grid');
		var gridStore = grid.getStore();
		gridStore.each(function(record) {
			record.set('status', 'Y');
		});
	},
	
	/**
	 * 저장 버튼 클릭시 
	 */
	onClickSave: function(popup) {
		var viewParams = popup.getParams();
		var mainView = this.getMainView();
		var gridStore = popup.child('grid').getStore();
		var params = {prod_order_id : viewParams.id};
		var operators = new Array();
		var emptyOperator = false;
		
		gridStore.each(function(record) {
			if(!record.data.user || !record.data.user.id) {
				emptyOperator = true;
			}
			
			if(record.data.status == 'Y') {
				if(!Ext.Array.contains(operators, record.data.user.id)) {
					operators.push(record.data.user.id);
				}
			}
		});
		
		if(emptyOperator) {
			HF.msg.notice(T('text.Empty data exist') + ' : ' + T('label.operator'));
			return;
		}
		
		if(operators.length == 0) {
			HF.msg.notice(T('text.Select x First', {x : T('label.operator')}));
			return;
		}
		
		params.operators = Ext.JSON.encode(operators);
		var self = this;
		Ext.Ajax.request({
			//url : '/domains/' + login.current_domain_id + '/diy_services/OpsStartOrder/shoot.json',
			url : '/domains/' + login.current_domain_id + '/ops/start_order.json',
			method : 'POST',
			params : params,
			success: function(response, opts) {
				mainView.fireEvent('afterJobStart', popup.getParams());
				popup.close();
			}
		});
	},
	
	onGridAdd : function(btn) {
		var grid = this.getJobStart().child('grid');
		var operatorStore = grid.getStore();
		operatorStore.worker_add_row();
	}
});
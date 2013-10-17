Ext.define('Ops.controller.pack.PackingStatus', {
	
	extend : 'Ops.abstract.OpsController',
	
	views : ['Ops.view.pack.PackingStatus'],
	
	requires : [ 
		'Ops.abstract.OpsController', 
	],
	
	refs: [ { 
		ref : 'MainView', selector : 'ops_pack_status' 
	} ],
		
	init : function() {
		this.control({
			'ops_pack_status' : {
				paramschange : this.onParamsChange
			},
			'ops_pack_status #btn_send' : {
				click : this.onPackingSend
			},
			'ops_pack_status #btn_check_all' : {
				click : this.onCheckAll
			},
			'ops_pack_status #btn_uncheck_all' : {
				click : this.onUncheckAll
			},
			'ops_pack_status #status' : {
				click : this.onStatusClick
			},
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
		
		view.store.getProxy().extraParams = {'_q[status-eq]' : '0', '_q[operation_id-eq]' : HF.setting.get('option-operation').id, '_o[created_at]' : 'desc'};
		view.store.load();
	},
	
	/**
	 * 상태 버튼 클릭시 
	 */
	onStatusClick : function(view, rowIndex, colIndex, item, e, record) {
		if(!record.data.status || record.data.status == '0') {
			record.set('status', '1');
		} else if(record.data.status == '1') {
			record.set('status', '0');
		}
	},

	/**
	 * Check All
	 */	
	onCheckAll : function() {
		var gridStore = this.getMainView().store;
		gridStore.each(function(record) {
			record.set('status', '1');
		});
	},
	
	/**
	 * Uncheck All
	 */	
	onUncheckAll : function() {
		var gridStore = this.getMainView().store;
		gridStore.each(function(record) {
			record.set('status', '0');
		});
	},	
	
	/**
	 * Packing 전송 
	 */	
	onPackingSend : function() {
		var sendList = [];
		var gridStore = this.getMainView().store;
		gridStore.each(function(record) {
			if(record.get('status') == '1') {
				sendList.push({'id' : record.data.id, 'status' : record.data.status, '_cud_flag_' : 'u'});
			}
		});
		
		if(sendList.length > 0) {
		    Ext.Ajax.request({
			    url : 'domains/' + login.current_domain_id + '/packings/update_multiple.json',
			    method : 'POST',
			    params : { multiple_data : Ext.JSON.encode(sendList) },
			    success : function(response) {
					gridStore.reload();
				}
			});
		} else {
			HF.msg.notice({title : 'Nothing Checked', msg : 'Check First!'});
		}
	}
});
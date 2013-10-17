Ext.define('Ops.controller.OpsController', {
	extend: 'Ext.app.Controller',
	
	requires: ['Ops.mixin.OpsExt'],

	stores: [],
	
	models: [],

	views: [],

	controllers: [],

	init: function() {
		var self = this;
		this.shiftChangeTimer();
		HF.setting.set('option-work_date', WORK_DATE);
		HF.setting.set('option-work_date_disp', Ext.util.Format.date(WORK_DATE, T('format.date')));
		HF.setting.set('option-shift', SHIFT);
		HF.setting.set('option-shift_name', SHIFT_NAME);
		
		Ext.each(this.controllers, function(ctl) {
			self.getController('Ops.controller.' + ctl);
		});

		this.control({
		});
		
		HF.mixin('Ops.mixin.OpsExt');
		
		HF.custom.optionbar([ {
			xtype : 'entityfield',
			name : 'option-workcenter',
			fieldLabel : T('label.wc'),
			labelWidth : 90,
			width : 170,
			storeClass : 'Prod.store.Workcenter',
			listeners : {
				afterrender : function(field) {
					if(!HF.setting.get('option-workcenter')) {
						HF.msg.tip(T('text.Select x First', {x : T('label.wc')}), field);
					}
				}
			}
		}, {
			xtype : 'entityfield',
			name : 'option-operation',
			fieldLabel : T('label.operation'),
			labelWidth : 80,
			width : 205,
			storeClass : 'Prod.store.Operation',
			pageSize : 9,
			associationField : [{
				name : 'workcenter_id-eq',
				value : function() {
					var wc = HF.setting.get('option-workcenter');
					return wc ? wc.id : '';
				}
			}],
			listeners : {
				afterrender : function(field) {
					if(!HF.setting.get('option-operation')) {
						HF.msg.tip(T('text.Select x First', {x : T('label.operation')}), field);
					}
				}
			}
		}, {
			xtype : 'displayfield',
			text : '',
			width : 5
		}, {
			xtype : 'button',
			text : T('button.search'),
			handler : function() {
				location.reload();
			}
		}, {
			xtype : 'displayfield',
			text : '',
			width : 5
		}, {
			xtype : 'textfield',
			name : 'option-work_date_disp',
			fieldLabel : T('label.work_date'),
			labelWidth : 55,
			width : 190,
			readOnly : true
		},	{
			xtype : 'textfield',
			name : 'option-shift_name',
			fieldLabel : T('label.shift'),
			labelWidth : 55,
			width : 125,
			readOnly : true
		}, {
			xtype : 'displayfield',
			text : '',
			width : 10
		} ]);
		
		this.operationInfo();
		HF.setting.on('option-operation', this.onOperationChange, this);
		if(HF.setting.get('option-operation')) {
			this.noticeTimer();
		}

		// Favorite를 모두 지우고 새로 추가하고 싶다면 아래 두 라인은 주석 처리 (Ops 메뉴가 바뀌었을 경우 ...)
		//var favstore = Ext.getStore('Favorite');
		//favstore.getProxy().clear();
		var menuStore = Ext.getStore('Menu');
		menuStore.on('load', function(store) {
			var favstore = Ext.getStore('Favorite');
			if(favstore.getCount() === 0) {
				store.each(function(record) {
					var tobeadded = Ext.clone(record.getData());
					delete tobeadded.id;
					favstore.add(tobeadded);
				});
			}
		});
	},
	
	/**
	 * Shift Change Timer 
	 * 좀 더 정확한 계산 로직 필요
	 */
	shiftChangeTimer : function() {
		var shiftChangeTask = new Ext.util.DelayedTask(function() {
			HF.msg.notice({
				msg : T('text.Time to shift change'),
				fn : function(confirmBtn) {
					location.reload();
				}
			});
		});
		
		shiftChangeTask.delay(SHIFT_CHANGE_DELAY);
	},
	
	noticeTimer : function() {
		// TODO Setting으로 
		var interval = 60000 * 10;
		
		var noticeTask = new Ext.util.DelayedTask(function() {
			if(HF.setting.get('option-operation') && HF.setting.get('option-operation').id) {
				Ext.Ajax.request({
				    //url : '/domains/' + login.current_domain_id + '/diy_services/OpsNewNotice/query.json',
				url : '/domains/' + login.current_domain_id + '/notices/latest_notice.json',
				    method : 'GET',
				    params : {
						operation_id : HF.setting.get('option-operation').id,
						work_date : HF.setting.get('option-work_date')
					},
				    success: function(response, opts) {
						var obj = Ext.decode(response.responseText);
						if(Object.keys(obj).length > 0) {
							HF.popup('Ops.view.noti.NoticePopup', obj, null);
						}
						noticeTask.delay(interval);
					},
					failure: function(response, opts) {
						noticeTask.delay(interval);
					}
				});
			} else {
				noticeTask.delay(interval);
			}
		});
		
		noticeTask.delay(interval);
	},
	
	operationInfo : function() {
		if(HF.setting.get('option-operation')) {
			operation_id = HF.setting.get('option-operation').id;
			Ext.Ajax.request({
			    url: '/domains/' + login.current_domain_id + '/operations/' + operation_id + '.json',
			    method : 'GET',
			    success: function(response, opts) {
					var obj = Ext.decode(response.responseText);
					HF.setting.set('option-operation_info', obj);
					// OPS 들어가서 활성화된 메뉴가 없다면 기본으로 생산현황 화면이 실행된다.
					var content = Ext.getCmp('content');
					if(content) {
						if(!content.getLayout().getActiveItem()) {
							HF.show('Ops.view.prod.ProdMain', null, {});
						}
					}
				}
			});
		}
	},
	
	onOperationChange : function() {
		if(HF.setting.get('option-operation')) {
			operation_id = HF.setting.get('option-operation').id;
			Ext.Ajax.request({
			    url: '/domains/' + login.current_domain_id + '/operations/' + operation_id + '.json',
			    method : 'GET',
			    success: function(response, opts) {
					var obj = Ext.decode(response.responseText);
					HF.setting.set('option-operation_info', obj);
				}
			});
		}
	}
});

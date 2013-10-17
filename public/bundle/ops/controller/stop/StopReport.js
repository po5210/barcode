/**
 * LineStop Report
 */
Ext.define('Ops.controller.stop.StopReport', {
	
	extend : 'Ops.abstract.OpsController',
	
	views : ['Ops.view.stop.StopReport'],
	
	refs: [ 
		{ ref : 'MainView', selector : 'ops_stop_main' }
	],
	
	init : function() {
		this.control({
			'ops_stop_report' : {
				paramschange : this.onParamsChange,
				click_save : this.onClickSave,
				click_close : this.onClickClose
			}
		});
	},
	
	onParamsChange : function(view, params) {
		// update
		if(params.reporter_id || params.breakdown_code) {
			var opName = params.operation.name + '  (' + params.operation.desc + ')';
			var mcName = params.machine.name + '  (' + params.machine.desc + ')';
			view.child(' #operation').setValue(opName);
			view.child(' #machine').setValue(mcName);
			view.child(' #breakdown_code').setValue(params.breakdown_code);
			view.child(' #line_stop_flag').setValue(params.line_stop_flag);
			view.child(' #reporter').setValue(params.reporter);
			view.child(' #reporter_comment').setValue(params.reporter_comment);
			view.child(' #event_time').setValue(params.event_time);
		// create
		} else {
			var opName = params.operation + '  (' + params.operation_desc + ')';
			var mcName = params.machine + '  (' + params.machine_desc + ')';
			view.child(' #operation').setValue(opName);
			view.child(' #machine').setValue(mcName);
			view.child(' #event_time').setValue(new Date());
		}
	},
	
	onClickSave: function(popup, grid) {
		var popupParams = popup.getParams();
		var formView = popup.child('form');
		var eventTime = formView.child('#event_time').getValue();
		
		if(!this.checkTime(eventTime)) {
			return;
		}
		
		var formValues = formView.getForm().getValues();
		var machineLoss = null;
		var self = this;
		
		if(!formValues.breakdown_code || formValues.breakdown_code == '') {
			HF.msg.notice(T('text.Select x First', {x : T('label.breakdown_code')}));
			return;
		}
		
		if(!formValues.reporter_id || formValues.reporter_id == '') {
			HF.msg.notice(T('text.Select x First', {x : T('label.reporter')}));
			return;
		}
		
		// update
		if(popupParams.reporter_id || popupParams.breakdown_code) {
			popupParams.line_stop_flag = formValues.line_stop_flag;
			popupParams.breakdown_code = formValues.breakdown_code;
			popupParams.reporter_comment = formValues.reporter_comment;
			popupParams.reporter_id = formValues.reporter_id;
			popupParams.event_time = eventTime;
			machineLoss = Ext.create('Prod.model.MachineLoss', popupParams);
			
		// create
		} else {
			var formData = {
				prod_order_id : popupParams.id,
				line_stop_flag : formValues.line_stop_flag,
				breakdown_code : formValues.breakdown_code,
				reporter_comment : formValues.reporter_comment,
				reporter_id : formValues.reporter_id,
				event_time : eventTime,
				status : '1'
			};
			machineLoss = Ext.create('Prod.model.MachineLoss', formData);
		}
		
		machineLoss.save({
			success : function(record, operation) {
				popup.close();
				var stopMain = self.getMainView();
				if(stopMain) {
					var gridStore = stopMain.child('grid').getStore();
					gridStore.load();
				}
			}
		});
	},

	/**
	 * 신고 시간 validation
	 */
	checkTime : function(eventTime) {
		if(!eventTime) {
			HF.msg.notice({title : T('text.Invalid data'), msg : T('text.Empty data exist') + ' : ' + T('label.event_time')});
			return false;
		}
		
		var currentTime = new Date();
		if(eventTime > currentTime) {
			HF.msg.notice({title : T('text.Invalid Time'), msg : T('text.X greater than Y', {x : T('label.event_time'), y : T('label.current_time')})});
			return false;
		}
		
		return true;
	}
});
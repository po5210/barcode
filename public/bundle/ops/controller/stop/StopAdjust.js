/**
 * LineStop Adjust
 */
Ext.define('Ops.controller.stop.StopAdjust', {
	
	extend : 'Base.abstract.FormController',
	
	views : [ 'Ops.view.stop.StopAdjust' ],
	
	refs: [ { ref : 'MainView', selector : 'ops_stop_main' } ],
	
	init : function() {
		this.control({
			'ops_stop_adjust' : {
				paramschange : this.onParamsChange,
				click_save : this.onClickSave,
				click_close : this.onClickClose
			}
		});
	},
	
	onParamsChange : function(view, params) {
		var opName = params.operation.name + ' (' + params.operation.desc + ')';
		var mcName = params.machine.name + ' (' + params.machine.desc + ')';
		view.child(' #operation').setValue(opName);
		view.child(' #machine').setValue(mcName);
		var lineStopFlag = params.line_stop_flag;
		var lineStop = (!lineStopFlag) ? 'N' : ((lineStopFlag == 'false' || lineStopFlag == '0' || lineStopFlag == 'n' || lineStopFlag == 'no') ? 'N' : 'Y')
		view.child(' #line_stop_flag').setValue(lineStop);
		view.child(' #reporter').setValue(params.reporter.name);
		view.child(' #event_time').setValue(Ext.util.Format.date(params.event_time, T('format.datetime')));
		view.child(' #reporter_comment').setValue(params.reporter_comment);
		view.child(' #breakdown_code').setValue(params.breakdown_code);
		view.child(' #maint_start_time').setValue(params.event_time);
		view.child(' #maint_end_time').setValue(new Date());
	},
	
	onClickSave: function(popup) {
		var popupParams = popup.getParams();
		var formView = popup.child('form');
		var maintStartTime = formView.child(' #maint_start_time').getValue();
		var maintEndTime = formView.child(' #maint_end_time').getValue();
		
		if(!this.checkTime(popupParams.event_time, maintStartTime, maintEndTime)) {
			return;
		}
		
		var formValues = formView.getForm().getValues();
		
		if(!formValues.breakdown_code || formValues.breakdown_code == '') {
			HF.msg.notice({title : T('text.Invalid data'), msg : T('text.Empty data exist') + ' : ' + T('label.breakdown_code')});
			return false;
		}
		
		if(!formValues.maintainer_id || formValues.maintainer_id == '') {
			HF.msg.notice({title : T('text.Invalid data'), msg : T('text.Empty data exist') + ' : ' + T('label.maintainer')});
			return false;
		}
		
		popupParams.status = '2';
		popupParams.breakdown_code = formValues.breakdown_code;
		popupParams.maint_comment = formValues.maint_comment;
		popupParams.maintainer_count = formValues.maintainer_count;
		popupParams.maintainer_id = formValues.maintainer_id;
		popupParams.maint_start_time = maintStartTime;
		popupParams.maint_end_time = maintEndTime;
		
		var self = this;
		var machineLoss = Ext.create('Prod.model.MachineLoss', popupParams);
		machineLoss.save({
			success : function(record, operation) {
				var gridStore = self.getMainView().child('grid').getStore();
				gridStore.load();
				popup.close();
			}
		});
	},
	
	/**
	 * 1. 조치 시작 시간은 report time보다 커야 하고 현재 시간, 조치 완료시간 보다는 작아야 하고 
	 * 2. 조치 완료 시간은 조치 시작 시간보다는 커야 하고 현재 시간보다는 작아야 한다.
	 */
	checkTime : function(eventTime, maintStartTime, maintEndTime) {
		if(!maintStartTime) {
			HF.msg.notice({title : T('text.Invalid data'), msg : T('text.Empty data exist') + ' : ' + T('label.maint_start_time')});
			return false;
		}
		
		if(!maintEndTime) {
			HF.msg.notice({title : T('text.Invalid data'), msg : T('text.Empty data exist') + ' : ' + T('label.maint_end_time')});
			return false;
		}
		
		var currentTime = new Date();
		
		if(maintStartTime > currentTime) {
			HF.msg.notice({title : T('text.Invalid Time'), msg : T('text.X greater than Y', {x : T('label.maint_start_time'), y : T('label.current_time')})});
			return false;
		}
		
		if(maintEndTime > currentTime) {
			HF.msg.notice({title : T('text.Invalid Time'), msg : T('text.X greater than Y', {x : T('label.maint_end_time'), y : T('label.current_time')})});
			return false;
		}
		
		if(maintStartTime < eventTime) {
			HF.msg.notice({title : T('text.Invalid Time'), msg : T('text.X greater than Y', {x : T('label.event_time'), y : T('label.maint_start_time')})});
			return false;
		}
		
		if(maintStartTime > maintEndTime) {
			HF.msg.notice({title : T('text.Invalid Time'), msg : T('text.X greater than Y', {x : T('label.maint_start_time'), y : T('label.maint_end_time')})});
			return false;
		}
		
		return true;
	}
});
/**
 * Mold Breakdown Report
 */
Ext.define('Ops.controller.mold.MoldReport', {

	extend : 'Ops.abstract.OpsController',

	views : ['Ops.view.mold.MoldReport'],

	refs: [ 
		{ ref : 'MainView', selector : 'ops_mold_main' }
	],

	init : function() {
		this.control({
			'ops_mold_report' : {
				paramschange : this.onParamsChange,
				click_save : this.onClickSave,
				click_close : this.onClickClose
			}
		});
	},

	onParamsChange : function(view, params) {
		// update
		if(params.reporter_id || params.breakdown_code) {
			view.child(' #operation').setValue(params.operation.name);
			view.child(' #operation_desc').setValue(params.operation.desc);
			view.child(' #mold').setValue(params.mold);
			view.child(' #mold_loss_code').setValue(params.mold_loss_code);
			view.child(' #reporter').setValue(params.reporter);
			view.child(' #reporter_comment').setValue(params.reporter_comment);
			view.child(' #event_time').setValue(params.event_time);
		// create
		} else {
			view.child(' #operation').setValue(params.operation);
			view.child(' #operation_desc').setValue(params.operation_desc);
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

		if(!formValues.mold_id || formValues.mold_id == '') {
			HF.msg.notice(T('text.Select x First', {x : T('label.mold')}));
			return;
		}

		if(!formValues.mold_loss_code || formValues.mold_loss_code == '') {
			HF.msg.notice(T('text.Select x First', {x : T('label.breakdown_code')}));
			return;
		}

		if(!formValues.reporter_id || formValues.reporter_id == '') {
			HF.msg.notice(T('text.Select x First', {x : T('label.reporter')}));
			return;
		}

		// update
		if(popupParams.reporter_id || popupParams.mold_loss_code) {
			popupParams.mold_id = formValues.mold_id;
			popupParams.mold_loss_code = formValues.mold_loss_code;
			popupParams.reporter_comment = formValues.reporter_comment;
			popupParams.reporter_id = formValues.reporter_id;
			popupParams.event_time = eventTime;
			machineLoss = Ext.create('Mld.model.MoldLoss', popupParams);

		// create
		} else {
			var formData = {
				prod_order_id : popupParams.id,
				mold_id : formValues.mold_id,
				mold_loss_code : formValues.mold_loss_code,
				reporter_comment : formValues.reporter_comment,
				reporter_id : formValues.reporter_id,
				event_time : eventTime,
				status : '1'
			};
			machineLoss = Ext.create('Mld.model.MoldLoss', formData);
		}

		machineLoss.save({
			success : function(record, operation) {
				HF.msg.success(T('text.Success to Process'));
				popup.close();
				var moldMain = self.getMainView();
				if(moldMain) {
					var gridStore = moldMain.child('grid').getStore();
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
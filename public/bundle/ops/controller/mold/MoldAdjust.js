/**
 * Mold Adjust
 */
Ext.define('Ops.controller.mold.MoldAdjust', {
	
	extend : 'Base.abstract.FormController',
	
	views : [ 'Ops.view.mold.MoldAdjust' ],
	
	refs: [ 
		{ ref : 'MainView', selector : 'ops_mold_main' },
		{ ref : 'AdjustView', selector : 'ops_mold_adjust' }
	],
	
	init : function() {
		this.control({
			'ops_mold_adjust' : {
				paramschange : this.onParamsChange,
				click_add : this.onGridAdd,
				click_save : this.onClickSave,
				click_close : this.onClickClose
			}
		});
	},
	
	onParamsChange : function(view, params) {
		var opName = params.operation.name + ' (' + params.operation.desc + ')';
		var moldName = params.mold.name + ' (' + params.mold.desc + ')';
		view.child(' #operation').setValue(opName);
		view.child(' #mold').setValue(moldName);
		view.child(' #reporter').setValue(params.reporter.name);
		view.child(' #event_time').setValue(Ext.util.Format.date(params.event_time, T('format.datetime')));
		view.child(' #reporter_comment').setValue(params.reporter_comment);
		view.child(' #mold_loss_code').setValue(params.mold_loss_code);
		view.child(' #maint_start_time').setValue(params.event_time);
		view.child(' #maint_end_time').setValue(new Date());
		view.child('grid').getStore().removeAll();
	},
	
	onClickSave: function(popup) {
		var popupParams = popup.getParams();
		var formView = popup.child('form');
		var sparePartView = popup.child('grid');
		var maintStartTime = formView.child(' #maint_start_time').getValue();
		var maintEndTime = formView.child(' #maint_end_time').getValue();
		
		if(!this.checkTime(popupParams.event_time, maintStartTime, maintEndTime)) {
			return;
		}
		
		var formValues = formView.getForm().getValues();
		
		if(!formValues.mold_loss_code || formValues.mold_loss_code == '') {
			HF.msg.notice({title : T('text.Invalid data'), msg : T('text.Empty data exist') + ' : ' + T('label.breakdown_code')});
			return false;
		}
		
		if(!formValues.maintainer_id || formValues.maintainer_id == '') {
			HF.msg.notice({title : T('text.Invalid data'), msg : T('text.Empty data exist') + ' : ' + T('label.maintainer')});
			return false;
		}
		
		popupParams.status = '2';
		popupParams.mold_loss_code = formValues.mold_loss_code;
		popupParams.maint_comment = formValues.maint_comment;
		popupParams.maintainer_count = formValues.maintainer_count;
		popupParams.maintainer_id = formValues.maintainer_id;
		popupParams.maint_start_time = maintStartTime;
		popupParams.maint_end_time = maintEndTime;
		
		// Spare Part
		var gridStore = sparePartView.getStore();
		var gridDelRecords = gridStore.getRemovedRecords();
		var gridValues = [];
		
		gridStore.each(function(record) {
			gridValues.push({
				'id' : record.data.id, 
				'spare_part_id' : record.data.spare_part.id, 
				'used_qty' : record.data.used_qty, 
				'_cud_flag' : record.data._cud_flag
			});
		});
		
		for(var i = 0 ; i < gridDelRecords.length ; i++) {
			var delRecord = gridDelRecords[i];
			gridValues.push({
				'id' : delRecord.data.id, 
				'spare_part_id' : delRecord.data.spare_part.id, 
				'used_qty' : delRecord.data.used_qty, 
				'_cud_flag' : 'd'
			});
		}
		
		popupParams.spare_part_usages = gridValues;
		var self = this;
		var machineLoss = Ext.create('Mld.model.MoldLoss', popupParams);
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
	},
	
	/**
	 * SparePart Grid Add
	 */
	onGridAdd : function(btn) {
		var view = this.getAdjustView().child('grid');
		var sparePartStore = view.getStore();
		sparePartStore.add_row();
	}
});
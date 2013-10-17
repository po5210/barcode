/**
 * Notice Popup Controller
 */
Ext.define('Ops.controller.noti.NoticePopup', {
	
	extend : 'Base.abstract.PopupController',
	
	views : ['Ops.view.noti.NoticePopup'],
	
	init : function() {
		this.control({
			'ops_noti_popup' : {
				paramschange : this.onParamsChange,
				click_confirm : this.onConfirm
			}
		});
	},
	
	onParamsChange : function(view, params) {
		view.down('#operation').setValue(params.operation ? params.operation.name : 'ALL');
		view.down('#operation_desc').setValue(params.operation ? params.operation.desc : '');
		view.down('#work_date').setValue(Ext.util.Format.date(params.created_at, T('format.date')));
		view.down('#created_at').setValue(Ext.util.Format.date(params.created_at, T('format.time')));
		view.down('#msg').setValue(params.msg);
	},
	
	onConfirm : function(popup) {
		var params = popup.getParams();
		
		Ext.Ajax.request({
			//url : '/domains/' + login.current_domain_id + '/diy_services/OpsConfirmNotice/shoot.json',
			url : '/domains/' + login.current_domain_id + '/notices/confirm_notice.json',
			method : 'POST',
			params : {
				notice_id : popup.getParams().id,
				operation_id : HF.setting.get('option-operation').id
			},
			success: function(response, opts) {
				popup.close();
			}
		});
	}
});
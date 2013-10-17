/**
 * Notice Main
 */
Ext.define('Ops.controller.noti.NoticeMain', {
	
	extend : 'Base.abstract.PanelController',
	
	views : ['Ops.view.noti.NoticeMain'],
	
	init : function() {
		this.control({
			'ops_noti_main' : {
				paramschange : this.onParamsChange
			},
			'ops_noti_main #noti_report' : {
				click : this.onNoticeView
			}
		});
	},
	
	onParamsChange : function(view, params) {
		if(!HF.setting.get('option-operation')) {
			var field = Ext.getCmp('optionbar').down('field[name=option-operation]');
			HF.msg.tip(T('text.Select Operation First'), field);
			return;
		}
		
		var grid = view.down('grid');
		var store = grid.getStore();
		var queryParams = {
			'_q[operation_id-eq]' : HF.setting.get('option-operation').id,
			'_q[work_date-gte]' : HF.setting.get('option-work_date')
		};
		store.getProxy().extraParams = queryParams;
		store.load();
	},
	
	onNoticeView : function(grid, item, rowIndex, colIndex, e, record) {
		record.data.mode = 'list';
		HF.popup('Ops.view.noti.NoticePopup', record.data, null);
	}
});
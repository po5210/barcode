/**
 * MoldBreakdown Main
 */
Ext.define('Ops.controller.mold.MoldMain', {
	
	extend : 'Base.abstract.FormController',
	
	views : [ 'Ops.view.mold.MoldMain' ],
	
	refs: [ { ref : 'MainView', selector : 'ops_mold_main' } ],
	
	init : function() {
		this.control({
			'ops_mold_main' : {
				paramschange : this.onParamsChange
			},
			'ops_mold_main #mold_report' : {
				click : this.onMoldReport
			},
			'ops_mold_main #mold_adjust' : {
				click : this.onMoldAdjust
			},
			'ops_mold_main #btn_mold' : {
				click : this.onMoldStop
			}
		});
	},
	
	onParamsChange : function(view, params) {
		view.store.getProxy().extraParams = {'_q[status-eq]' : '1', '_o[event_time]' : 'desc'};
		view.store.load();
	},

	onMoldAdjust : function(grid, item, rowIndex, colIndex, e, record) {
		HF.popup('Ops.view.mold.MoldAdjust', record.data, null);
	},
	
	onMoldReport : function(grid, item, rowIndex, colIndex, e, record) {
		HF.popup('Ops.view.mold.MoldReport', record.data, null);
	},
	
	onMoldStop : function() {
		HF.popup('Ops.view.mold.MoldReport', {}, {});
	},
});
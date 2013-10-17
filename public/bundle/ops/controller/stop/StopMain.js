/**
 * LineStop Main
 */
Ext.define('Ops.controller.stop.StopMain', {
	
	extend : 'Base.abstract.FormController',
	
	views : [ 'Ops.view.stop.StopMain' ],
	
	refs: [ { ref : 'MainView', selector : 'ops_stop_main' } ],
	
	init : function() {
		this.control({
			'ops_stop_main' : {
				paramschange : this.onParamsChange
			},
			'ops_stop_main #line_stop_report' : {
				click : this.onLineStopReport
			},
			'ops_stop_main #line_stop_adjust' : {
				click : this.onLineStopAdjust
			},
			'ops_stop_main #btn_line_stop' : {
				click : this.onLineStop
			}
		});
	},
	
	onParamsChange : function(view, params) {
		view.store.getProxy().extraParams = {'_q[status-eq]' : '1', '_o[event_time]' : 'desc'};
		view.store.load();
	},

	onLineStopAdjust : function(grid, item, rowIndex, colIndex, e, record) {
		HF.popup('Ops.view.stop.StopAdjust', record.data, null);
	},
	
	onLineStopReport : function(grid, item, rowIndex, colIndex, e, record) {
		HF.popup('Ops.view.stop.StopReport', record.data, null);
	},
	
	onLineStop : function() {
		HF.popup('Ops.view.stop.StopReport', {}, {});
	},
});
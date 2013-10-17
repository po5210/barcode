/**
 * Job Info
 */
Ext.define('Ops.controller.prod.JobInfo', {
	
	extend : 'Ops.abstract.OpsController',
	
	views : ['Ops.view.prod.JobInfo'],
	
	refs: [ { 
		ref : 'JobInfo', 
		selector : 'ops_prod_job_info' 
	} ],
	
	init : function() {
		this.control({
			'ops_prod_job_info' : {
				paramschange : this.onParamsChange,
				click_close : this.onClickClose
			}
		});
	},
	
	onParamsChange : function(view, params) {
		view.child(' #operation').setValue(params.operation);
		view.child(' #operation_desc').setValue(params.operation_desc);
		view.child(' #product').setValue(params.product);
		view.child(' #product_desc').setValue(params.product_desc);
		view.child(' #machine').setValue(params.machine);
		view.child(' #machine_desc').setValue(params.machine_desc);
		view.child(' #priority').setValue(params.order_seq);
		view.child(' #lot_size').setValue(params.pallet_qty);
		view.child(' #plan').setValue(params.order_qty);
		view.child(' #actual').setValue(params.actual_qty);
		view.child(' #defect').setValue(params.defect_qty);
		view.child(' #rework').setValue(params.rework_qty);
	}
});
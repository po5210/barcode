Ext.define('Ops.controller.docs.SheetPopup', {
	
	extend : 'Base.abstract.FormController',
	
	views : ['Ops.view.docs.SheetPopup'],
	
	init : function() {
		this.control({
			'ops_docs_popup' : {
				paramschange : this.onParamsChange,
				click_ok : this.onClickClose
			}
		});
	},
	
	onParamsChange : function(view, params) {
		view.down('#workcenter').setValue(view.getParams().workcenter);
		view.down('#operation').setValue(view.getParams().operation);
		view.down('#title').setValue(view.getParams().title);
		view.down('#reg_date').setValue(view.getParams().reg_date);
	}
});
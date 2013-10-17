/**
 * Add Plan
 */
Ext.define('Ops.controller.prod.AddPlan', {
	
	extend : 'Ops.abstract.OpsController',
	
	views : ['Ops.view.prod.AddPlan'],
	
	refs: [
		{ ref : 'MainView', selector : 'ops_prod_main' }
	],
	
	init : function() {
		this.control({
			'ops_prod_add_plan' : {
				paramschange : this.onParamsChange,
				click_save : this.onClickSave,
				click_close : this.onClickClose
			}
		});
	},
	
	onParamsChange : function(view, params) {
	},
	
	onClickSave: function(popup) {
		var form = popup.child('form');
		var data = form.getForm().getValues();
		
		if(!data.machine_id || data.machine_id == '') {
			HF.msg.notice(T('text.Select x First', {x : T('label.machine')}));
			return;
		}
		
		if(!data.product_id || data.product_id == '') {
			HF.msg.notice(T('text.Select x First', {x : T('label.product')}));
			return;
		}
		
		var self = this;
		var newOrders = [];
		newOrders.push({
			'order_date' : HF.setting.get('option-work_date'),
			'shift' : HF.setting.get('option-shift'),
			'operation_id' : HF.setting.get('option-operation').id,
			'machine_id' : data.machine_id,
			'status' : 'W',
			'order_qty' : 0,
			'product_id' : data.product_id
		});
		
		Ext.Ajax.request({
			//url : '/domains/' + login.current_domain_id + '/diy_services/OpsAddPlan/shoot.json',
			url : '/domains/' + login.current_domain_id + '/ops/create_order.json',
			method : 'POST',
			//params : { addPlans : Ext.JSON.encode(newOrders) },
			params : { new_orders : Ext.JSON.encode(newOrders) },
			success: function(response, opts) {
				popup.close();
				var view = self.getMainView();
				var gridStore = view.child('grid').getStore();
				gridStore.load();
			}
		});
	}
});
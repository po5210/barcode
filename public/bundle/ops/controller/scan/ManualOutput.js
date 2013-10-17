/** 
 * Manual Output
 */
Ext.define('Ops.controller.scan.ManualOutput', {
	
	extend : 'Ops.abstract.OpsController',
		
	views : ['Ops.view.scan.ManualOutput'],
	
	refs : [ 
		{ ref : 'MainView', selector : 'ops_scan_manual' },
		{ ref : 'ProdMainView', selector : 'ops_prod_main' }
	],
	
	init : function() {
		this.control({
			'ops_scan_manual' : {
				paramschange : this.onParamsChange,
				click_close : this.onClickClose,
				click_save : this.onSave,
				click_keypad : this.onKeyPad
			}
		});
	},
	
	onParamsChange : function(popup, params) {
		this.reload(popup, null);
	},
	
	onSave : function(popup) {
		var self = this;
		var currentActual = popup.child(' #actual_qty').getValue();
		currentActual = parseInt(currentActual);
		var qty = popup.child('#qty').getValue();
		var reason = popup.child('#reason').getValue();
		
		if(!qty || qty == '' || qty == 0) {
			HF.msg.notice(T('text.Empty data exist') + ' : ' + T('label.qty'));
		} else {
			if(qty > 10000) {
				HF.msg.notice(T('text.X greater than Y', {x : T('label.qty'), y : '10000'}));
				return;
			}
			
			if(qty < -10000) {
				HF.msg.notice(T('text.X less than Y', {x : T('label.qty'), y : '-10000'}));
				return;
			}
			
			if(currentActual + qty < 0) {
				HF.msg.notice(T('text.X less than Y', {x : T('label.actual_qty') + '(' + currentActual + ') ', y : T('label.modify_qty') + '(' + qty + ')'}));
				return;
			}
			
			Ext.Ajax.request({
				url : '/domains/' + login.current_domain_id + '/ops/do_manual_output.json',
				method : 'POST',
				params : {
					prod_order_id : popup.getParams().id,
					actual_qty : qty,
					description : reason,
					operation_id : popup.getParams().operation_id,
				},
			    success: function(response, opts) {
					var obj = Ext.decode(response.responseText);
					self.reload(popup, obj.actual_qty);
					var prodMainView = self.getProdMainView();
					var prodMainViewStore = prodMainView.child('grid').getStore();
					prodMainViewStore.load();
					popup.close();
				}
			});
		}
	},
	
	onKeyPad : function(popup, e) {
		var actualField = popup.child('#qty');
		HF.popup('Ops.view.cmm.TouchPadPopup', {owner : actualField, owner_type : 'simple', data_type : 'number'}, {});
	},
	
	reload : function(popup, current_actual_qty) {
		var viewParams = popup.getParams();
		popup.child(' #operation').setValue(viewParams.operation);
		popup.child(' #product').setValue(viewParams.product);
		popup.child(' #product_desc').setValue(viewParams.product_desc);
		popup.child(' #machine').setValue(viewParams.machine);
		popup.child(' #plan_qty').setValue(viewParams.order_qty);
		popup.child('#qty').reset();
		popup.child('#reason').reset();
		var actual = popup.child(' #actual_qty');
		
		if(current_actual_qty) {
			actual.setValue(current_actual_qty);
		} else {
			actual.setValue(viewParams.actual_qty);
		}
	}
});
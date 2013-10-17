/**
 * Modify Lot Controller
 */
Ext.define('Ops.controller.prod.ModifyLot', {
	
	extend : 'Ops.abstract.OpsController',
	
	views : ['Ops.view.prod.ModifyLot'],
	
	refs: [ 
		{ ref : 'MainView', selector : 'ops_prod_main' },
		{ ref : 'ModifyView', selector : 'ops_prod_modify_lot' },
		{ ref : 'ProdListView', selector : 'ops_prod_list' }
	],
	
	init : function() {
		this.control({
			'ops_prod_modify_lot' : {
				paramschange : this.onParamsChange,
				click_save : this.onClickSave,
				click_close : this.onClickClose
			},
			'ops_prod_modify_lot #keypad' : {
				click : this.onKeyPad
			}
		});
	},
	
	onParamsChange : function(view, params) {
		view.child(' #date').setValue(params.work_date);
		view.child(' #shift').setValue(params.shift);
		view.child(' #operation').setValue(params.operation ? params.operation.name : '');
		view.child(' #machine').setValue(params.machine ? params.machine.name : '');
		view.child(' #product').setValue(params.product ? params.product.name : '');
		view.child(' #product_desc').setValue(params.product ? params.product.desc : '');
		view.child(' #actual_qty').setValue(params.actual_qty);
		view.child(' #scan_time').setValue(params.tran_time);
	},
	
	onKeyPad : function(btn, e) {
		var view = this.getModifyView();
		var modifyField = view.child(' #modify_qty');
		HF.popup('Ops.view.cmm.TouchPadPopup', {owner : modifyField, owner_type : 'simple', data_type : 'number'}, {});		
	},
	
	onClickSave: function(popup) {
		var formView = popup.child('form');
		var modifyQty = popup.child(' #modify_qty').getValue();
		var reason = popup.child(' #description').getValue();
		var lotId = popup.getParams().id;
		var actualQty = popup.getParams().actual_qty;
		
		if(!modifyQty) {
			HF.msg.notice({title : T('text.Invalid data'), msg : T('text.Empty data exist')});
			return;
		}
		
		if(modifyQty > 10000) {
			HF.msg.notice(T('text.X less than Y', {x : T('label.qty'), y : '10000'}));
			return;
		}

		// 수정 값이 음수일 경우 실적보다 절대값이 커서는 안된다.
		if(modifyQty < 0 && (-1 * modifyQty) > actualQty) {
			HF.msg.notice({title : T('text.Invalid data'), msg : T('text.X greater than Y', {x : T('label.modify_qty'), y : T('label.actual_qty')})});
			return;
		}
		
		var self = this;
		var params = {'lot_id' : lotId, 'modify_qty' : modifyQty, 'description' : reason};

		Ext.Ajax.request({
			url : '/domains/' + login.current_domain_id + '/ops/update_lot.json',
			method : 'POST',
			params : params,
			success : function(response, opts) {
				popup.close();
				var prodListView = self.getProdListView();
				var gridStore = prodListView.child('grid').getStore();
				gridStore.reload();
			}
		});
	}
});
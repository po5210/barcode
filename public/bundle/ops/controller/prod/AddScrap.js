/**
 * Add Scrap
 */
Ext.define('Ops.controller.prod.AddScrap', {
	
	extend : 'Ops.abstract.OpsController',
	
	views : ['Ops.view.prod.AddScrap'],
	
	refs: [ 
		{ ref : 'MainView', selector : 'ops_prod_main' },
		{ ref : 'ScrapView', selector : 'ops_prod_add_scrap' }
	],
	
	init : function() {
		this.control({
			'ops_prod_add_scrap' : {
				paramschange : this.onParamsChange,
				click_save : this.onClickSave,
				click_add : this.onGridAdd,
				click_close : this.onClickClose
			},
			'ops_prod_add_scrap #rework_keypad' : {
				click : this.onReworkKeyPad
			},
			'ops_prod_add_scrap #grid_keypad' : {
				click : this.onGridKeyPad
			}
		});
	},
	
	onParamsChange : function(view, params) {
		var viewParams = view.getParams();
		view.child(' #operation').setValue(viewParams.operation);
		view.child(' #product').setValue(viewParams.product);
		view.child(' #machine').setValue(viewParams.machine);
		view.child(' #actual').setValue(viewParams.actual_qty);
		view.child(' #defect').setValue(viewParams.defect_qty);
		view.child(' #rework').setValue(viewParams.rework_qty);
	},
	
	onReworkKeyPad : function(btn, e) {
		var view = this.getScrapView();
		var reworkField = view.child(' #rework_qty');
		HF.popup('Ops.view.cmm.TouchPadPopup', {owner : reworkField, owner_type : 'simple', data_type : 'number'}, {});
	},
	
	onGridKeyPad : function(gridView, td, rowIndex, colIndex, event, record, tr, grid) {
		var params = {owner : gridView.store, owner_type : 'store', data_type : 'number', row_idx : rowIndex, field : 'defect_qty'};
		HF.popup('Ops.view.cmm.TouchPadPopup', params, {});
	},
	
	onGridAdd : function(btn) {
		var view = this.getScrapView().child('grid');
		var badAddStore = view.getStore();
		badAddStore.add_row();
	},
	
	onClickSave: function(popup) {
		var popupParams = popup.getParams();
		var self = this;
		var gridStore = popup.child('grid').getStore();
		var newRecords = gridStore.getNewRecords();
		var rework_qty = popup.child(' #rework_qty').getValue();
		var defect_info = [];
		
		for (var i = 0 ; i < newRecords.length ; i++) {
			var defectCode = newRecords[i].get('defect_code');
			var defectQty = newRecords[i].get('defect_qty');
			
			if(!defectCode || !defectCode.id) {
				HF.msg.notice({title : T('text.Invalid data'), msg : T('text.Empty data exist') + ' : ' + T('label.defect_code')});
				return;
			}
			
			if(!defectQty || defectQty == '' || defectQty == 0) {
				HF.msg.notice({title : T('text.Invalid data'), msg : T('text.Empty data exist') + ' : ' + T('label.defect_qty')});
				return;
			}
			
			defect_info.push({'machine_id' : popupParams.machine_id, 'product_id' : popupParams.product_id, 'defect_code_id' : defectCode.id, 'defect_qty' : defectQty});
		}
		
		Ext.Ajax.request({
		    //url : '/domains/' + login.current_domain_id + '/diy_services/OpsAddScrap/shoot.json',
			url : '/domains/' + login.current_domain_id + '/ops/create_scrap.json',
		    method : 'POST',
		    params : {
				prod_order_id : popupParams.id,
				work_date : HF.setting.get('option-work_date') ? HF.setting.get('option-work_date') : "",
				shift : HF.setting.get('option-shift') ? HF.setting.get('option-shift') : "",
				operation_id : popupParams.operation_id,
				defect_info : Ext.JSON.encode(defect_info),
				rework_qty : rework_qty
			},
		    success: function(response, opts) {
				var obj = Ext.decode(response.responseText);
				popup.close();
				gridStore.load();
				
				var mainView = self.getMainView();
				var mainViewStore = mainView.child('grid').getStore();
				mainViewStore.load();
			}
		});
	}
});
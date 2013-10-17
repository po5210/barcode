Ext.define('Ops.controller.scan.ProdInputMain', {
	
	extend : 'Ops.abstract.OpsController',
	
	requires : ['Prod.store.Lot'],
	
	views : ['Ops.view.scan.ProdInputMain'],
	
	refs: [ 
		{ ref : 'MainView', selector : 'ops_prod_input_main' },
	],
	
	init : function() {
		this.control({
			'ops_prod_input_main' : {
				paramschange : this.onParamsChange
			},
			'ops_prod_input_main #update_input' : {
				click : this.onInputUpdate
			},
			'ops_prod_input_main #delete_input' : {
				click : this.onInputDelete
			}
		});
	},
	
	onParamsChange : function(view, params) {
		if(!HF.setting.get('option-operation')) {
			var field = Ext.getCmp('optionbar').down('field[name=option-operation]');
			HF.msg.tip(T('text.Select Operation First'), field);
			return;
		}
		
		if(params) {
			var grid = view.child('grid');
			var store = grid.getStore();
			store.getProxy().extraParams = params;
			grid.getStore().load();
		} else {
			var grid = view.child('grid');
			var store = grid.getStore();
			store.getProxy().extraParams = {
				'input_op-eq' : HF.setting.get('option-operation').name,
				'track_qty-gte' : 0
			};
			store.load();
		}
	},
	
	onInputUpdate : function(grid, item, rowIndex, colIndex, e, record) {
		//HF.popup('Ops.view.scan.UpdateProdInput', record.data, null);
	},
	
	onInputDelete : function(grid, rowIndex, colIndex, item, e, record) {
		HF.msg.confirm({
			msg : T('text.Sure to Delete'),
			fn : function(confirmBtn) {
				if(confirmBtn == 'yes') {
					Ext.Ajax.request({
					    url: '/domains/' + login.current_domain_id + '/ops/cancel_prod_input.json',
					    method : 'POST',
					    params : {
							lot_id : record.data.id,
							mode : 'delete'
						},
					    success: function(response, opts) {
							var obj = Ext.decode(response.responseText);
							HF.msg.alert({title : obj.message, msg : T('text.Success to Process')});

							grid.getStore().load();
						}
					});
				}
			}
		});
		
	},
	
	onClickClose : function(view) {
		view.close();
	},
	
	onBackClick : function() {
		HF.history.back();
	}
});
/**
 * Request Material
 */
Ext.define('Ops.controller.prod.RequestMaterial', {
	
	extend : 'Ops.abstract.OpsController',
	
	views : ['Ops.view.prod.RequestMaterial'],
	
	refs: [
		{ ref : 'MainView', selector : 'ops_prod_main' }
	],
	
	init : function() {
		this.control({
			'ops_prod_req_mat' : {
				paramschange : this.onParamsChange,
				click_save : this.onClickSave,
				click_close : this.onClickClose
			}
		});
	},
	
	onParamsChange : function(view, params) {
	},
	
	onClickClose : function(view) {
		view.close();
	},
	
	onClickSave: function(popup) {
		var formView = popup.child('form');
		
		if (!formView.getForm().isValid()) {
			HF.msg.notice(T('text.Invalid data'));
			return;
		}
		
		var lotSize = formView.down('textfield[name=lot_size]').getValue();
		var reqQty = formView.down('numberfield[name=request_qty]').getValue();
		var normalFlag = ((reqQty % lotSize) == 0);
						
		if(!normalFlag) {
			HF.msg.confirm({
				msg : T('text.Mismatch X', {x : 'Lot Size'}) + ', ' + T('text.Sure to Going On'),
				fn : function(btn) {
					if(btn == 'yes') {
						this.requestMaterial(popup);
					}
				},
				scope: this
			});
		} else {
			this.requestMaterial(popup);
		}
	},
	
	requestMaterial : function(popup) {
		popup.child('form').getForm().submit({
		    clientValidation : true,
			url : '/domains/' + login.current_domain_id + '/ops/request_material.json',
			params : {
				'prod_order_id' : popup.getParams().id,
				'request_time' : Ext.util.Format.date(new Date(), 'YmdHim'),
				'request_date' : Ext.util.Format.date(HF.setting.get('option-work_date'), 'Ymd'),
				'remote_ip' : REMOTE_IP
			},
			timeout : 20000,
		    success: function(form, action) {
				var result = action.result;
				popup.close();
				if(result.success) {
					HF.msg.success({title : result.message, msg : T('text.Success to Process')});
				} 
		    }
		});
	}
});
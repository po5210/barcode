/**
 * Touch Pad Popup Controller
 */
Ext.define('Ops.controller.cmm.TouchPadPopup', {
	
	extend : 'Ops.abstract.OpsController',
	
	views : ['Ops.view.cmm.TouchPadPopup'],
	
	requires : [
		'Ops.abstract.OpsController'
	],
	
	refs: [ 
		{ ref : 'MainView', selector : 'ops_touch_pad_popup' },
	],
	
	init : function() {
		this.control({
			'ops_touch_pad_popup' : {
				paramschange : this.onParamsChange,
				click_delete : this.onClickDelete,
				click_confirm : this.onClickConfirm,
				click_clear : this.onClickClear,
				click_close : this.onClickClose
			},
			'ops_touch_pad_popup button' : {
				click : this.onClickPad
			}
		});		
	},
	
	onParamsChange : function(view) {
	},
		
	onClickPad : function(btn) {
		var buttonId = btn.itemId;
		var btnPrefix = btn.itemId.substring(0, 5);
		
		if(btnPrefix == 'input') {
			var text = this.getMainView().child(' textfield');
			var val = text.getValue();
			val = val + btn.text;
			text.setValue(val);
		} else if(buttonId == 'ctrl_delete') {
			this.onClickDelete(btn);
		} else if(buttonId == 'ctrl_confirm') {
			this.onClickConfirm(btn);
		} else if(buttonId == 'ctrl_clear') {
			this.onClickClear(btn);
		} else if(buttonId == 'ctrl_close') {
			this.onClickClose(this.getMainView());
		}
	},
	
	onClickDelete : function(btn) {
		var text = this.getMainView().child(' textfield');
		var val = text.getValue();
		if(val && val.length > 0) {
			val = val.substring(0, val.length - 1);
			text.setValue(val);
		}
		text.focus(false);
	},
	
	onClickConfirm : function(btn) {
		var view = this.getMainView();
		var text = view.child(' textfield');
		var owner = view.getParams().owner;
		var ownerType = view.getParams().owner_type;
		var dataType = view.getParams().data_type;
		
		if(owner) {
			var val = text.getValue();
			if(dataType == 'number') {
				val = parseInt(val);
			} 
			
			if(ownerType == 'simple') {
				owner.setValue(val);
			} else if(ownerType == 'store') {
				var field = view.getParams().field;
				var rowIdx = view.getParams().row_idx;
				var store = owner;
				var model = store.getAt(rowIdx);
				model.set(field, val);
			}
		}
		
		view.close();
	},
	
	onClickClear : function(btn) {
		var text = this.getMainView().child(' textfield');
		text.reset();
	}
});
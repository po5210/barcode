Ext.define('Base.controller.user.UserPopup', {

	extend: 'Base.abstract.PopupController',

	models: ['Base.model.User'],

	views: ['Base.view.user.UserPopup'],

	refs: [{
		selector: 'base_user_popup',
		ref: 'userPopup'
	}],

	init: function() {
		this.control({
			'base_user_popup': {
				paramschange: this.onParamsChange,
				click_close: this.onClickClose,
				click_save: this.onClickSave
			},
			'base_usercolumn': {
				userpopup: this.onUserPopup
			},
			'base_user_popup form': {
				validitychange: this.onValidityChange
			}
		});
	},

	onParamsChange: function(popup, params) {
		if(params.id) {
			var formView = popup.down('form');
			Base.model.User.load(params.id, {
				success: function(user) {
					formView.getForm().setValues(user.data);
				}
			});
			formView.child('textfield[name=login]').setReadOnly(true);
		} else {
			popup.down('button#save').setDisabled(true);
		}
	},

	onUserPopup: function(column, user) {
		HF.popup('Base.view.user.UserPopup', user);
	},

	onValidityChange: function(form, valid) {
		this.getUserPopup().down('button#save').setDisabled(!valid);
	},

	onClickSave: function(popup) {
		var formView = popup.down('form');
		var form = formView.getForm();
		
		if(!form.isValid()) {
			HF.msg.alert('Validation Error, Please Check Form Items');
			return;
		}
		
		var values = form.getValues();
		if (values.id) {
			// update
			var user = Ext.create('Base.model.User', values);
			user.save({
				success: function(record, operation) {
					var newRecord = operation.resultSet.records[0];
					popup.fireEvent('after_form_saved', newRecord);
					popup.close();
				}
			});
		} else {
			// create
			var user = {};
			Ext.iterate(values, function(name, value) {
				if (name != 'id') {
					user['user[' + name + ']'] = value;
				}
			});
			Ext.Ajax.request({
				url: 'add_user.json',
				method: 'POST',
				params: user,
				success: function(response) {
					var res = Ext.JSON.decode(response.responseText);
					popup.fireEvent('after_form_saved', res);
					popup.close();
				}
			});
		}
	}
});

Ext.define('Base.controller.setting.Setting', {
	extend : 'Base.abstract.FormController',

	views : ['Base.view.setting.Setting'],

	refs : [ {
		selector : 'base_setting',
		ref : 'setting'
	} ],
	
	init : function() {
		this.control({
			'base_setting' : {
				afterrender : this.onAfterRender,
				click_save : this.onClickSave,
				click_reset : this.onClickReset,
				click_close : this.onClickClose
			}
		});
	},
	
	onAfterRender : function () {
		this.getSetting().getForm().setValues(HF.setting.all(function(id, value) {
			return id.indexOf('setting-') === 0;
		}));
	},
	
	onClickSave : function () {
		Ext.Object.each(this.getSetting().getForm().getFieldValues(), function(name, value) {
			HF.setting.set(name, value);
			HF.msg.success(T('text.Success to Save'));
		});
	},
	
	onClickReset : function () {
		this.getSetting().getForm().reset();
	}
});
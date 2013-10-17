Ext.define('Base.view.field.EntityNameField', {
	extend: 'Ext.form.field.Picker',

	xtype: ['base_entitynamefield', 'entitynamefield'],

	triggerCls: Ext.baseCSSPrefix + 'form-arrow-trigger',

	editable: true,
	
	matchFieldWidth : false,
	
	displayAttribute : 'name',
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);

		this.addEvents('select');
	},

	createPicker: function() {
		return Ext.create('Base.view.common.EntityPicker', Ext.Object.merge({
			host: this
		}, this.pickerConfig));
	},

	selectItem: function(picker, record) {
		var me = this;

		me.setValue(record.get(this.displayAttribute));

		me.collapse();
		/* TODO Form내에서 이 컨트롤을 사용해서 값을 선택하면, 포커스를 잃어버리는 현상이 발생한다. 원인이 불명확해서 100ms의 딜레이를 주어서 활성화한다. */
		Ext.defer(function() {
			me.inputEl.focus();
		}, 100);
		me.fireEvent('select', me, record)
	},
	
	cancelSelect: function(picker) {
		var me = this;

		me.collapse();
		/* TODO Form내에서 이 컨트롤을 사용해서 값을 선택하면, 포커스를 잃어버리는 현상이 발생한다. 원인이 불명확해서 100ms의 딜레이를 주어서 활성화한다. */
		Ext.defer(function() {
			me.inputEl.focus();
		}, 100);
	}
	
});

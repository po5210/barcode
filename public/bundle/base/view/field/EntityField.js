Ext.define('Base.view.field.EntityField', {
	extend: 'Ext.form.field.Picker',

	xtype: ['base_entityfield', 'entityfield', 'entitycolumneditor'],

	triggerCls: Ext.baseCSSPrefix + 'form-arrow-trigger',

	editable: false,
	
	matchFieldWidth : false,
	
	displayAttribute : 'name',
	
	initComponent: function() {
		this.callParent(arguments);

		this.addEvents('select');
		
		this.on('specialkey', function(field, e) {
			if (e.getKey() == e.ENTER) {
				if(field.rawValue && (!field.value || field.rawValue != field.value[field.displayAttribute])) {
					field.expand();
					e.stopEvent();
				}
			}
        });
		
		this.on('blur', function(field, e) {
			if(!field.rawValue) {
				field.setValue(undefined);
				return;
			}
			
			if(field.value) {
				field.setValue(field.value);
			} else {
				field.setValue(field.originalValue);
			}

			if(field.value)
				field.setRawValue(field.value[field.displayAttribute]);
		});
	},

	createPicker: function() {
		return Ext.create('Base.view.common.EntityPicker', Ext.Object.merge({
			host: this
		}, this.pickerConfig));
	},

	selectItem: function(picker, record) {
		var me = this;
		if(!this.value || record.get('id') !== this.value.id) {
			var old = me.getValue();
			var val = {
				id : record.get('id'),
				/*  toString function to invoke 'change' event. */
				toString : function() {
					return this.id;
				}
			};
			val[this.displayAttribute] = record.get(this.displayAttribute);
			me.setValue(val);
		}

		me.collapse();
		/* TODO Form내에서 이 컨트롤을 사용해서 값을 선택하면, 포커스를 잃어버리는 현상이 발생한다. 원인이 불명확해서 100ms의 딜레이를 주어서 활성화한다. */
		Ext.defer(function() {
			me.inputEl.focus();
		}, 100);
		me.fireEvent('select', me, record);
	},
	
	cancelSelect: function(picker) {
		var me = this;

		me.collapse();
		/* TODO Form내에서 이 컨트롤을 사용해서 값을 선택하면, 포커스를 잃어버리는 현상이 발생한다. 원인이 불명확해서 100ms의 딜레이를 주어서 활성화한다. */
		Ext.defer(function() {
			me.inputEl.focus();
		}, 100);
	},
	
	rawToValue: function(rawValue) {
		if(!rawValue)
			return undefined;

		return this.value;
    },

    valueToRaw: function(value) {
		if(value && value.hasOwnProperty(this.displayAttribute))
			return value[this.displayAttribute];

		return value;
	},
	
	getSubmitData : function() {
		var name = this.getName() + '_id';
		var data = {};
		data[name] = this.value ? this.value.id : '';

		return data;
	}
});

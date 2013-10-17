Ext.define('Base.view.field.EntitySearchCombo', {
	extend : 'Ext.form.FieldContainer',
	
	xtype : ['base_entitysearchcombo', 'entitysearchcombo'],

	layout : 'hbox',

	defaults : {
		flex : 1,
		hideLabel : true
	},
	
	initComponent : function() {		
		this.items = [{
			xtype: 'entitynamecombo',
			name: this.name,
			margin: '0 5 0 0',
			storeClass : this.storeClass,
			customSelectionUrl : this.customSelectionUrl,
			valueField : this.valueField,
			associationField : this.associationField
		}, {
			xtype: 'textfield',
			name: this.name + '-desc',
			disabled: true
		}];

		this.callParent();
		
		var entityCombo = this.down(' entitynamecombo');
		var entityValueText = this.down(' textfield');
		var entityDescText = this.down(' textfield[name=' + this.name + '-desc]');
		
		entityValueText.on('specialkey', function(field, e, eOpts) {
			if(e.DELETE) {
				entityDescText.setValue('');
			}
		});		
		
		entityCombo.on('select', function(me, record) {
			if(entityDescText) {
				entityDescText.setValue(record[0].data.description);
			}
		});
	}
});

Ext.define('Base.view.field.CodeField', {
    extend: 'Ext.form.field.Picker',

    xtype: ['base_codefield', 'codefield'],

    triggerCls: Ext.baseCSSPrefix + 'form-arrow-trigger',

    editable: true,

    initComponent: function() {
        var me = this;
        me.callParent(arguments);

        this.addEvents(
            'select'
        );
    },

    createPicker: function() {
		return Ext.create('Base.view.common.CodePicker', {
			host : this
		});
    },

    selectItem: function(picker, record) {
        var me = this;
        me.record = record;
        me.setValue(record.get('description'));

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
	},

    getSubmitValue: function(){
    	if(this.record){
    		return this.record.get('name');
    	}else{
    		return '';
    	}
    },

	/**
	 * Form Reset 시에 값을 비워준다.
	 */
	reset : function() {
		this.record = null;
		this.setValue('');
	}
});
Ext.define('Base.view.field.CodeCombo', {
	extend : 'Ext.form.field.ComboBox',
	
	xtype : ['base_codecombo', 'codecombo', 'codecolumneditor'],

    anchor: '100%',

	editable : false,

	config : {
		valueField : 'name',
		displayField : 'name',

		queryMode : 'local',
		
	    minChars: 1, 
	    typeAhead: true,
		triggerAction : 'all'
	},
	
	// 빈 값일 경우 표시할 글자 
	blankDisplay : '',

    listConfig: {
        loadingText: T('text.Searching...'),
        emptyText: T('text.No matching data found.'),

        getInnerTpl: function() {
            return '<div><span>{name}</span>{description}</div>';
        },
		minWidth : 200
    },

	initComponent : function() {
		this.callParent();

		this.bindStore(HF.code_store(this.commonCode));
	}
});
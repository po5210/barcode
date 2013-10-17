Ext.define('Base.view.setting.Setting', {
	extend : 'Base.abstract.Form',

	xtype : 'base_setting',

	title : T('title.setting'),

	dockedItems : {
		xtype : 'controlbar',
		items : [ '->', 'save', 'reset', 'close' ]
	},

	items : [ {
		xtype : 'container',
		layout : 'anchor',
		defaults : {
			anchor : '100%'
		},
		items : [ {
			xtype : 'container',
			layout : {
				align : 'stretch',
				type : 'hbox'
			},
			items : [ {
				xtype : 'textfield',
				fieldLabel : T('setting.setting-agent-url'),
				name : 'setting-agent-url',
				itemId : 'txtAgent'
			}, {
				xtype : 'button',
				text : T('button.test'),
				itemId : 'btnAgentTest'
			}/*, {
				xtype : 'checkbox',
				fieldLabel : '',
				inputValue : 'Y',
				unCheckedValue : 'N',
				boxLabel : T('setting.setting-keep-agent-url'),
				name : 'setting-keep-agent-url'
			}*/ ]
		}, {
			xtype : 'menuseparator'
		} ]
	} ],

	initComponent : function() {
		this.callParent();
		
		Ext.Array.each(HF.custom.setting(), function(component) {
			try {
				this.add(component);
				this.add({
					xtype: 'menuseparator',
					cls : 'marginTB5'
				});
			} catch (e) {
				HF.error(T('error.CUSTOM-LOCAL-SETTING-FAILURE', {
					view : component
				}), e);
			}
		}, this);
	}
});
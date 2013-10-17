Ext.define('Base.view.user.UserPopup', {

	extend: 'Base.abstract.Popup',

	xtype: 'base_user_popup',

	title: T('button.user_profile'),
	
	height : 450,

	items: [{
		xtype: 'form',

		defaults: {
			xtype: 'textfield',
			anchor: '100%'
		},

		items: [{
			xtype: 'hidden',
			name: 'id'
		}, {
			xtype: 'textfield',
			name: 'login',
			fieldLabel: T('label.login'),
			vtype : 'presence',
			allowBlank : false
		}, {
			xtype: 'textfield',
			name: 'name',
			fieldLabel: T('label.name'),
			allowBlank : false
		}, {
			xtype: 'textfield',
			name: 'email',
			vtype: 'email',
			fieldLabel: T('label.email'),
			allowBlank : false
		}, {
			xtype: 'textfield',
			name: 'password',
			fieldLabel: T('label.password'),
			inputType: 'password',
			minLength : 4,
			maxLength : 128
		}, {
			xtype: 'textfield',
			name: 'password_confirmation',
			fieldLabel: T('label.password_confirmation'),
			inputType: 'password',
			minLength : 4,
			maxLength : 128,
			validator: function(value) {
				var pwd = this.previousSibling('[name=password]');
				return (value === pwd.getValue()) ? true : T('text.Passwords do not match')
			}
		}, {
			name: 'default_domain',
			fieldLabel: T('label.default_domain'),
			hidden : true
			//xtype: 'entityfield',
			//storeClass: 'Base.store.Domain'
		}, {
			xtype: 'textfield',
			name: 'dept',
			fieldLabel: T('label.dept'),
			xtype: 'codecombo',
			commonCode: 'PROD_DEPT',
			displayField : 'description'
		}, {
			name: 'lang',
			fieldLabel: T('label.language'),
			hidden : true
			//xtype: 'codecombo',
			//commonCode: 'LANGUAGE'
		}, {
			name: 'timezone',
			fieldLabel: T('label.timezone'),
			//xtype: 'combo',
			//store: 'Timezone',
			//queryMode: 'local',
			//displayField: 'display',
			//valueField: 'value',
			hidden : true
		}, {
			xtype: 'checkbox',
			name: 'admin_flag',
			inputValue : true,
			fieldLabel: T('label.admin')
		}, {
			xtype: 'checkbox',
			name: 'operator_flag',
			inputValue : true,
			fieldLabel: T('label.operator_flag')
		} ]
	}],

	dockedItems: [{
		xtype: 'controlbar',
		items: ['->', 'save', 'close']
	}]
});

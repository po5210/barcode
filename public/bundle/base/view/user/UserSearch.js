Ext.define('Base.view.user.UserSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'base_user_search',
	
	items : [ {
		name : 'login-like',
		fieldLabel : T('label.login')
	}, {
		name : 'name-like',
		fieldLabel : T('label.name')
	}, {
		name : 'email-like',
		fieldLabel : T('label.email')
	}, { 
		fieldLabel : T('label.department'), 
		name : 'dept-eq', 
		xtype : 'codecombo', 
		commonCode : 'PROD_DEPT', 
		valueField : 'name', 
		displayField : 'description'
	}, {
		name : 'admin_flag-eq',
		fieldLabel : T('label.admin'),
		xtype : 'checkbox',
		inputValue : true
	}, {
		name : 'operator_flag-eq',
		fieldLabel : T('label.operator_flag'),
		xtype : 'checkbox',
		inputValue : true
	} ]
});
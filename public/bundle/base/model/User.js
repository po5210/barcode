Ext.define('Base.model.User', {
	extend : 'Ext.data.Model',
	
	fields : [ {
		name : 'id',
		type : 'string'
	}, {
		name : 'login',
		type : 'string'
	}, {
		name : 'email',
		type : 'string'
	}, {
		name : 'name',
		type : 'string'
	}, {
		name : 'password',
		type : 'string'
	}, {
		name : 'password_confirmation',
		type : 'string'
	}, {
		name : 'admin_flag',
		type : 'bool'
	}, {
		name : 'default_domain_id',
		type : 'string'
	}, {
		name : 'default_domain',
		type : 'auto'
	}, {
		name : 'dept',
		type : 'string'
	}, {
		name : 'timezone',
		type : 'string'
	}, {
		name : 'lang',
		type : 'string'
	}, {
		name : 'operator_flag',
		type : 'boolean'
	}, {
		name : 'updated_at',
		type : 'date'
	} ],
	
	validations : [
		{type: 'presence',  field: 'name'},
		{type: 'presence',  field: 'email'},
		{type: 'email',  field: 'email'}
	],
	
  	proxy: {
		type: 'rest',
		url : '/users',
		format : 'json',
	    reader: {
			type: 'json'
        },
        writer: {
			type: 'json'
        }
	}
});
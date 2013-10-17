Ext.define('Base.store.Entity', {

	extend : 'Ext.data.Store',

	requires: 'Base.model.Entity',

	model : 'Base.model.Entity',

	autoLoad : false,

	remoteFilter : true,

	remoteSort : true,

	pageSize : 50,

	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/entities',
		format : 'json',
	    reader: {
			type: 'json',
			root: 'items',
			successProperty : 'success',
			totalProperty : 'total'
        },
        writer: {
			type: 'json'
        }
	}

});
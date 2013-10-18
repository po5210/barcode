Ext.define('Bar.store.Baseloc', {
	
	extend : 'Ext.data.Store',
	
	requires: 'Bar.model.Baseloc',
	
	model : 'Bar.model.Baseloc',
	
	autoLoad : false,
	
	remoteFilter : false,
	
	remoteSort : false,
	
	pageSize : 50,
	
	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/baselocs',
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
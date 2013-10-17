Ext.define('Base.store.Terminology', {
	
	extend : 'Ext.data.Store',
	
	model : 'Base.model.Terminology',
	
	autoLoad : false,
	
	remoteFilter : true,
	
	remoteSort : true,
	
	buffered : false,
	
	pageSize : 100,
	
	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/terminologies',
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
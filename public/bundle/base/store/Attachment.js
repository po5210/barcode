Ext.define('Base.store.Attachment', {
	
	extend : 'Ext.data.Store',
	
	model : 'Base.model.Attachment',
	
	autoLoad : false,
	
	remoteFilter : true,
	
	remoteSort : true,
	
	// buffered : false,
	
	pageSize : 100,
	
	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/attachments',
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
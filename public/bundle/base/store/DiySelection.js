Ext.define('Base.store.DiySelection', {
	
	extend : 'Ext.data.Store',
	
	requires: 'Base.model.DiySelection',
	
	model : 'Base.model.DiySelection',
	
	autoLoad : false,
	
	remoteFilter : true,
	
	remoteSort : true,
	
	buffered : false,
	
	pageSize : 50,
	
	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/diy_selections',
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
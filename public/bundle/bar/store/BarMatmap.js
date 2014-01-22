Ext.define('Bar.store.BarMatmap', {
	
	extend : 'Ext.data.Store',
	
	requires: 'Bar.model.BarMatmap',
	
	model : 'Bar.model.BarMatmap',
	
	autoLoad : false,
	
	remoteFilter : false,
	
	remoteSort : false,
	
	pageSize : 50,
	
	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/bar_matmaps',
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
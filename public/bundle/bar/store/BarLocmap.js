Ext.define('Bar.store.BarLocmap', {
	
	extend : 'Ext.data.Store',
	
	requires: 'Bar.model.BarLocmap',
	
	model : 'Bar.model.BarLocmap',
	
	autoLoad : false,
	
	remoteFilter : false,
	
	remoteSort : false,
	
	pageSize : 50,
	
	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/bar_locmaps',
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
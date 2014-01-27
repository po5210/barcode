Ext.define('Bar.store.BarMatout', {
	
	extend : 'Ext.data.Store',
	
	requires: 'Bar.model.BarMatout',
	
	model : 'Bar.model.BarMatout',
	
	autoLoad : false,
	
	remoteFilter : false,
	
	remoteSort : false,
	
	pageSize : 50,
	
	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/bar_matouts',
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
Ext.define('Bar.store.Instock', {
	
	extend : 'Ext.data.Store',
	
	requires: 'Bar.model.Instock',
	
	model : 'Bar.model.Instock',
	
	autoLoad : false,
	
	remoteFilter : false,
	
	remoteSort : false,
	
	pageSize : 50,
	
	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/instocks',
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
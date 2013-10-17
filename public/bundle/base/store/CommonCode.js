Ext.define('Base.store.CommonCode', {
	
	extend : 'Ext.data.Store',
	
	requires: 'Base.model.CommonCode',
	
	model : 'Base.model.CommonCode',
	
	autoLoad : false,
	
	remoteFilter : true,
	
	remoteSort : true,
	
	pageSize : 1000,
	
	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/common_codes',
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
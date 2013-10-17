Ext.define('Base.store.Role', {
	
	extend : 'Ext.data.Store',
	
	requires: 'Base.model.Role',
	
	model : 'Base.model.Role',
	
	autoLoad : false,

	remoteFilter : true,
	
	remoteSort : true,
	
	pageSize : 50,
	
  	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/roles',
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
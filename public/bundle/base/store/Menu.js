Ext.define('Base.store.Menu', {
	
	extend : 'Ext.data.Store',
	
	requires: 'Base.model.Menu',
	
	model : 'Base.model.Menu',
	
	autoLoad : false,
	
	remoteFilter : true,
	
	remoteSort : true,
	
	// buffered : true,
	
	// leadingBufferZone : 1000,
	
	pageSize : 1000,
	
	proxy : {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/menus',
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
	},
	
	sorters: [{
		property: 'rank',
		direction: 'ASC'
	}]
});
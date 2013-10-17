Ext.define('Base.store.DiyReport', {
	
	extend : 'Ext.data.Store',
	
	requires: 'Base.model.DiyReport',
	
	model : 'Base.model.DiyReport',
	
	autoLoad : false,
	
	remoteFilter : false,
	
	remoteSort : false,
	
	buffered : true,
	
	leadingBufferZone : 30,
	
	pageSize : 30,
	
	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/diy_reports',
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
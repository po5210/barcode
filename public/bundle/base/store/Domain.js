Ext.define('Base.store.Domain', {
	
	extend : 'Ext.data.Store',
	
	requires: 'Base.model.Domain',
	
	model : 'Base.model.Domain',
	
	autoLoad : false,
	
	remoteFilter : true,
	
	remoteSort : true,
	
	buffered : true,
	
	leadingBufferZone : 30,
	
	pageSize : 30,
	
	proxy: {
		type: 'rest',
		url : '/domains',
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
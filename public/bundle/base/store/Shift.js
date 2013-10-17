Ext.define('Base.store.Shift', {
	
	extend : 'Ext.data.Store',
	
	requires: 'Base.model.Shift',
	
	model : 'Base.model.Shift',
	
	autoLoad : false,
	
	remoteFilter : false,
	
	remoteSort : false,
	
	buffered : true,
	
	leadingBufferZone : 30,
	
	pageSize : 30,
	
	proxy: {
		type: 'rest',
		url : '/shifts',
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
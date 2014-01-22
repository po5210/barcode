Ext.define('Bar.store.PartGroup', {
	
	extend : 'Ext.data.Store',
	
	requires: 'Bar.model.PartGroup',
	
	model : 'Bar.model.PartGroup',
	
	autoLoad : false,
	
	remoteFilter : false,
	
	remoteSort : false,
	
	pageSize : 50,
	
	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/part_groups',
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
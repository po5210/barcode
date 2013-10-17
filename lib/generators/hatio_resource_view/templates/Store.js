Ext.define('<%= @bundle %>.store.<%= class_name %>', {
	
	extend : 'Ext.data.Store',
	
	requires: '<%= @bundle %>.model.<%= class_name %>',
	
	model : '<%= @bundle %>.model.<%= class_name %>',
	
	autoLoad : false,
	
	remoteFilter : false,
	
	remoteSort : false,
	
	pageSize : 50,
	
	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/<%= table_name %>',
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
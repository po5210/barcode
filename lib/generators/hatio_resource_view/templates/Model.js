Ext.define('<%= @bundle %>.model.<%= class_name %>', {
    
	extend: 'Ext.data.Model',
    
	<%= HatioResourceViewUtil.generateModelFields(@columns, "\t\t") %>,
	
  	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/<%= table_name %>',
		format : 'json',
	    reader: {
			type: 'json'
        },
        writer: {
			type: 'json'
        }
	}
});
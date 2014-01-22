Ext.define('Bar.store.InvoiceTest', {
	
	extend : 'Ext.data.Store',
	
	requires: 'Bar.model.InvoiceTest',
	
	model : 'Bar.model.InvoiceTest',
	
	autoLoad : false,
	
	remoteFilter : false,
	
	remoteSort : false,
	
	pageSize : 50,
	
	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/invoice_tests',
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
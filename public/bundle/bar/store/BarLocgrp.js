Ext.define('Bar.store.BarLocgrp', {
	
	extend : 'Ext.data.Store',
	
	requires: 'Bar.model.BarLocgrp',
	
	model : 'Bar.model.BarLocgrp',
	
	autoLoad : false,
	
	remoteFilter : false,
	
	remoteSort : false,
	
	pageSize : 50,
	
	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/bar_locgrps',
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
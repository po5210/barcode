Ext.define('Bar.model.Baseloc', {
    
	extend: 'Ext.data.Model',
    
	fields : [
		{ name : 'id', type : 'string' },
		{ name : 'domain_id', type : 'string' },
		{ name : 'name', type : 'string' },
		{ name : 'description', type : 'string' },
		{ name : 'baseloc_fg', type : 'string' },
		{ name : 'div_cd', type : 'string' },
		{ name : 'inloc_cd', type : 'string' },
		{ name : 'outloc_cd', type : 'string' },
		{ name : 'baseloc_nmk', type : 'string' },
		{ name : 'use_yn', type : 'string' },
		{ name : '_cud_flag_', type : 'string' }
	],
	
  	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/baselocs',
		format : 'json',
	    reader: {
			type: 'json'
        },
        writer: {
			type: 'json'
        }
	}
});
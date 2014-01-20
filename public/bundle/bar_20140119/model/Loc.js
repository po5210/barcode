Ext.define('Bar.model.Loc', {
    
	extend: 'Ext.data.Model',
    
	fields : [
		{ name : 'baseloc_cd', type : 'string' },
		{ name : 'loc_cd', type : 'string' },
		{ name : 'loc_nm', type : 'string' },
		{ name : 'loc_nmk', type : 'string' },
		{ name : 'loc_dc', type : 'string' },
		{ name : 'use_yn', type : 'string' },
		{ name : 'reg_id', type : 'string' },
		{ name : 'reg_dtm', type : 'string' },
		{ name : 'mod_id', type : 'string' },
		{ name : 'mod_dtm', type : 'string' },
		{ name : 'prod_line_fg', type : 'string' },
		{ name : 'erp_bloc', type : 'string' },
		{ name : 'erp_loc', type : 'string' },
		{ name : 'tmp_bloc', type : 'string' },
		{ name : 'tmp_loc', type : 'string' },
		{ name : 'reg_ip', type : 'string' },
		{ name : 'mod_ip', type : 'string' },
		{ name : '_cud_flag_', type : 'string' }
	],
	
  	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/locs',
		format : 'json',
	    reader: {
			type: 'json'
        },
        writer: {
			type: 'json'
        }
	}
});
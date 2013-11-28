Ext.define('Bar.model.Loc', {
    
	extend: 'Ext.data.Model',
    
	fields : [
		{ name : 'id', type : 'string' },
		{ name : 'domain_id', type : 'string' },
		{ name : 'name', type : 'string' },
		{ name : 'description', type : 'string' },
		{ name : 'baseloc_id', type : 'string' },
		{ name : 'baseloc', type : 'auto' },
		{ name : 'loc_nmk', type : 'string' },
		{ name : 'prod_line_fg', type : 'string' },
		{ name : 'erp_bloc', type : 'string' },
		{ name : 'erp_loc', type : 'string' },
		{ name : 'tmp_bloc', type : 'string' },
		{ name : 'tmp_loc', type : 'string' },
		{ name : 'use_yn', type : 'string' },
		{ name : 'creator_id', type : 'string' },
		{ name : 'creator', type : 'auto' },
		{ name : 'updater_id', type : 'string' },
		{ name : 'updater', type : 'auto' },
		{ name : 'created_at', type : 'date' },
		{ name : 'updated_at', type : 'date' },
		{ name : '_cud_flag_', type : 'string' }
	],

	validations : [
		{type : 'presence', field : 'name'}
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
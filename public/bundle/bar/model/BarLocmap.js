Ext.define('Bar.model.BarLocmap', {
    
	extend: 'Ext.data.Model',
    
	fields : [
		{ name : 'id', type : 'string' },
		{ name : 'domain_id', type : 'string' },
		{ name : 'bar_locgrp_id', type : 'string' },
		{ name : 'bar_locgrp', type : 'auto' },
		{ name : 'name', type : 'string' },
		{ name : 'description', type : 'string' },
		{ name : 'loc_nmk', type : 'string' },
		{ name : 'loc_dc', type : 'string' },
		{ name : 'use_yn', type : 'string' },
		{ name : 'creator_id', type : 'string' },
		{ name : 'creator', type : 'auto' },
		{ name : 'created_at', type : 'date' },
		{ name : 'updater_id', type : 'string' },
		{ name : 'updater', type : 'auto' },
		{ name : 'updated_at', type : 'date' },
		{ name : 'prod_line_fg', type : 'string' },
		{ name : 'erp_bloc', type : 'string' },
		{ name : 'erp_loc', type : 'string' },
		{ name : 'tmp_bloc', type : 'string' },
		{ name : 'tmp_loc', type : 'string' },
		{ name : 'reg_ip', type : 'string' },
		{ name : 'mod_ip', type : 'string' },
		{ name : '_cud_flag_', type : 'string' }
	],

	validations : [
		{type : 'presence', field : 'name'}
	],
	
  	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/bar_locmaps',
		format : 'json',
	    reader: {
			type: 'json'
        },
        writer: {
			type: 'json'
        }
	}
});
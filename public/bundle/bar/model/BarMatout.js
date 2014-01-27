Ext.define('Bar.model.BarMatout', {
    
	extend: 'Ext.data.Model',
    
	fields : [
		{ name : 'id', type : 'string' },
		{ name : 'domain_id', type : 'string' },
		{ name : 'name', type : 'string' },
		{ name : 'description', type : 'string' },
		{ name : 'who_dt', type : 'string' },
		{ name : 'who_sq', type : 'integer' },
		{ name : 'who_fg', type : 'string' },
		{ name : 'lot_qty', type : 'integer' },
		{ name : 'lot_rqty', type : 'integer' },
		{ name : 'item_cd', type : 'string' },
		{ name : 'bar_locgrp_id', type : 'string' },
		{ name : 'bar_locgrp', type : 'auto' },
		{ name : 'bar_locmap_id', type : 'string' },
		{ name : 'bar_locmap', type : 'auto' },
		{ name : 'outbaseloc_cd', type : 'string' },
		{ name : 'outloc_cd', type : 'string' },
		{ name : 'creator_id', type : 'string' },
		{ name : 'creator', type : 'auto' },
		{ name : 'updater_id', type : 'string' },
		{ name : 'updater', type : 'auto' },
		{ name : 'created_at', type : 'string' },
		{ name : 'updated_at', type : 'string' },
		{ name : 'created_ip', type : 'string' },
		{ name : 'updated_ip', type : 'string' },
		{ name : 'whi_dt', type : 'string' },
		{ name : 'whi_sq', type : 'integer' },
		{ name : 'lot_no', type : 'string' },
		{ name : 'ser_no', type : 'string' },
		{ name : 'internal_issue_no', type : 'string' },
		{ name : '26', type : 'string' },
		{ name : '27', type : 'string' },
		{ name : '28', type : 'string' },
		{ name : '29', type : 'string' },
		{ name : '_cud_flag_', type : 'string' }
	],

	validations : [
		{type : 'presence', field : 'name'}
	],
	
  	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/bar_matouts',
		format : 'json',
	    reader: {
			type: 'json'
        },
        writer: {
			type: 'json'
        }
	}
});
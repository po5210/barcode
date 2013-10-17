Ext.define('Base.model.CommonCode', {
    
	extend: 'Ext.data.Model',
    
	fields : [
		{ name : 'id', type : 'string' },
		{ name : 'domain_id', type : 'string' },
		{ name : 'name', type : 'string' },
		{ name : 'parent_id', type : 'string' },
		{ name : 'description', type : 'string' },
		{ name : 'creator_id', type : 'string' },
		{ name : 'updater_id', type : 'string' },
		{ name : 'creator', type : 'auto' },
		{ name : 'updater', type : 'auto' },
		{ name : 'created_at', type : 'date' },
		{ name : 'updated_at', type : 'date' },
		{ name : '_cud_flag_', type : 'string' }
],
	
  	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/common_codes',
		format : 'json',
	    reader: {
			type: 'json'
        },
        writer: {
			type: 'json'
        }
	}
});
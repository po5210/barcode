Ext.define('Base.model.Menu', {
    
	extend: 'Ext.data.Model',
    
	fields: [
		{ name : 'id', type : 'string' },
		{ name : 'name', type : 'string' },
		{ name : 'description', type : 'string' },
		{ name : 'domain_id', type : 'string' },
		{ name : 'parent_id', type : 'string' },
		{ name : 'resource_id', type : 'string' },
		{ name : 'template', type : 'string' },
		{ name : 'menu_type', type : 'string' },
		{ name : 'category', type : 'string' },
		{ name : 'rank', type : 'integer' },
		{ name : 'icon_path', type : 'string' },
		{ name : 'hidden_flag', type : 'boolean' },
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
		url : '/domains/' + login.current_domain_id + '/menus',
		format : 'json',
	    reader: {
			type: 'json'
        },
        writer: {
			type: 'json'
        }
	}
});
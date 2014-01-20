Ext.define('Bar.model.Invoice', {
    
	extend: 'Ext.data.Model',
    
	fields : [
		{ name : 'id', type : 'string' },
		{ name : 'product', type : 'auto' },
		{ name : 'product_name', type : 'string' },
		{ name : 'lot_size', type : 'integer' },
		{ name : 'unit_price', type : 'integer' },
		{ name : 'lot_qty', type : 'integer' },
		{ name : 'qty', type : 'integer' },
		{ name : 'total_price', type : 'integer' },
		{ name : 'part_no', type : 'string' },
		{ name : '_cud_flag_', type : 'string' }
	],

	validations : [
		{type : 'presence', field : 'name'}
	],
	
  	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/instocks',
		format : 'json',
	    reader: {
			type: 'json'
        },
        writer: {
			type: 'json'
        }
	}
});
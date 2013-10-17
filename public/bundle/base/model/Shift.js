Ext.define('Base.model.Shift', {
    
	extend: 'Ext.data.Model',
    
	fields : [
		{ name : 'id', type : 'string' },
		{ name : 'domain_id', type : 'string' },
		{ name : 'total_shift', type : 'integer' },
		{ name : 'shift1_start', type : 'string' },
		{ name : 'shift2_start', type : 'string' },
		{ name : 'shift3_start', type : 'string' },
		{ name : 'shift1_end', type : 'string' },
		{ name : 'shift2_end', type : 'string' },
		{ name : 'shift3_end', type : 'string' }
	],
	
  	proxy: {
		type: 'rest',
		url : '/shifts',
		format : 'json',
	    reader: {
			type: 'json'
        },
        writer: {
			type: 'json'
        }
	}
});
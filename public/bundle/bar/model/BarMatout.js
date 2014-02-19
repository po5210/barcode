Ext.define('Bar.model.BarMatout', {
    
	extend: 'Ext.data.Model',
    
	fields : [
		{ name : 'id', type : 'string' },
		{ name : 'who_dt', type : 'string' },
		{ name : 'who_sq', type : 'integer' },
		{ name : 'barcode', type : 'string' },
		{ name : 'who_fg', type : 'string' },
		{ name : 'lot_fg', type : 'string' },
		{ name : 'lot_qty', type : 'integer' },
		{ name : 'lot_rqty', type : 'integer' },
		{ name : 'item_cd', type : 'string' },
		{ name : 'baseloc_cd', type : 'string' },
		{ name : 'loc_cd', type : 'string' },
		{ name : 'outbaseloc_cd', type : 'string' },
		{ name : 'outloc_cd', type : 'string' },
		{ name : 'reg_id', type : 'string' },
		{ name : 'reg_dtm', type : 'string' },
		{ name : 'mod_id', type : 'string' },
		{ name : 'mod_dtm', type : 'string' },
		{ name : 'reg_ip', type : 'string' },
		{ name : 'mod_ip', type : 'string' },
		{ name : 'whi_dt', type : 'string' },
		{ name : 'whi_sq', type : 'integer' },
		{ name : 'lot_no', type : 'string' },
		{ name : 'ser_no', type : 'string' },
		{ name : 'dml_method', type : 'string' },
		{ name : 'erp_if', type : 'string' },
		{ name : '_cud_flag_', type : 'string' }
/*				
		{ name : 'domain_id', type : 'string' },
		{ name : 'name', type : 'string' },
		{ name : 'description', type : 'string' },
*/
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
Ext.define('Bar.model.Invoice', {
    
	extend: 'Ext.data.Model',
    
	fields : [
		{ name : 'id', type : 'string' },
	    { name : 'bill_nb', type : 'string' },
	    { name : 'tr_cd', type : 'string' },
	    { name : 'bill_dt', type : 'string' },
	    { name : 'lot_no', type : 'string' },
	    { name : 'prn_yn', type : 'string' },
	    { name : 'invoice_no', type : 'string' },
	    { name : 'po_no', type : 'string' },
	    { name : 'print_gubun', type : 'string' },
	    { name : 'unit_price', type : 'float' },
	    { name : 'price', type : 'float' },
	    { name : 'invoice_date', type : 'string' },
		{ name : 'item_info', type : 'auto' },
		{ name : '_cud_flag_', type : 'string' }
	],

	validations : [
		{ type : 'presence', field : 'bill_dt' },
		{ type : 'presence', field : 'tr_cd' }
	],
	
  	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/invoices',
		format : 'json',
	    reader: {
			type: 'json'
        },
        writer: {
			type: 'json'
        }
	}
});
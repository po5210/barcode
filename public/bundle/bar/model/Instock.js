Ext.define('Bar.model.Instock', {
    
	extend: 'Ext.data.Model',
    
	fields : [
		{ name : 'id', type : 'string' },
		{ name : 'bill_nb', type : 'string' },
		{ name : 'tr_cd', type : 'string' },
		{ name : 'bill_dt', type : 'string' },
		{ name : 'baseloc_cd', type : 'string' },
		{ name : 'loc_cd', type : 'string' },
		{ name : 'item_cd', type : 'string' },
		{ name : 'arrival_qty', type : 'integer' },
		{ name : 'invoice_no', type : 'string' },
		{ name : 'po_no', type : 'string' },
		{ name : 'bill_seq', type : 'integer' },
		{ name : 'in_dt', type : 'string' },
		{ name : 'price', type : 'float' },
		{ name : 'unit_price', type : 'float' },
		{ name : 'scan_qty', type : 'integer' },
		{ name : 'invoice_date', type : 'string' },
		{ name : 'detail_list', type : 'auto' }
	],

	validations : [
		{type : 'presence', field : 'tr_cd'}
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
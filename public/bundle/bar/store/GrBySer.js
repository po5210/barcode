Ext.define('Bar.store.GrBySer', {
	
	extend : 'Ext.data.Store',
	
	fields : [
		{ name : 'wh_dt', type : 'string' },
		{ name : 'tr_cd', type : 'string' },
		{ name : 'invoice_no', type : 'string' },
		{ name : 'invoice_date', type : 'string' },
		{ name : 'po_no', type : 'string' },		
		{ name : 'item_cd', type : 'string' },
		{ name : 'item_nm', type : 'string' },
		{ name : 'item_tp', type : 'string' },
		{ name : 'lot_size', type : 'integer' },
		{ name : 'object', type : 'string' },
		{ name : 'lot_no', type : 'string' },
		{ name : 'internal', type : 'string' },
		{ name : 'serial', type : 'string' },
		{ name : 'lot_rqty', type : 'integer' },
		{ name : 'baseloc_cd', type : 'string' },
		{ name : 'loc_cd', type : 'string' },		
		{ name : 'invoice_state', type : 'string' },
		{ name : 'reg_id', type : 'string' },
		{ name : 'reg_dtm', type : 'string' }		
	],
	
	autoLoad : false,
	
	pageSize : 50,
	
	remoteFilter : false,
	
	proxy : {
		type : 'ajax',
		url : '/domains/' + login.current_domain_id + '/diy_selections/GrBySer/query.json',
		format : 'json',
		reader : {
			type : 'json',
			root: 'items',
			successProperty : 'success',
			totalProperty : 'total'
		}
	}
});
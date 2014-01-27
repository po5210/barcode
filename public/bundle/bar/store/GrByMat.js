Ext.define('Bar.store.GrByMat', {
	
	extend : 'Ext.data.Store',
	
	fields : [
		{ name : 'bill_dt', type : 'string' },
		{ name : 'bill_nb', type : 'string' },
		{ name : 'tr_cd_name', type : 'string' },
		{ name : 'invoice_no', type : 'string' },
		{ name : 'invoice_date', type : 'string' },
		{ name : 'po_no', type : 'string' },		
		{ name : 'item_cd', type : 'string' },
		{ name : 'item_nm', type : 'string' },
		{ name : 'item_tp', type : 'string' },
		{ name : 'baseloc_cd', type : 'string' },
		{ name : 'loc_cd', type : 'string' },		
		{ name : 'lot_size', type : 'integer' },
		{ name : 'box_qty', type : 'integer' },
		{ name : 'in_qty', type : 'integer' },
		{ name : 'invoice_state', type : 'string' },
		{ name : 'reg_id', type : 'string' },
		{ name : 'reg_dtm', type : 'string' },
/*		
		{ name : 'outloc_cd', type : 'string' },
		{ name : 'outbaseloc_cd', type : 'string' }
*/		
	],
	
	autoLoad : false,
	
	pageSize : 50,
	
	remoteFilter : false,
	
	proxy : {
		type : 'ajax',
		url : '/domains/' + login.current_domain_id + '/diy_selections/GrByMat/query.json',
		format : 'json',
		reader : {
			type : 'json',
			root: 'items',
			successProperty : 'success',
			totalProperty : 'total'
		}
	}
});
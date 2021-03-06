Ext.define('Bar.store.GiByMat', {
	
	extend : 'Ext.data.Store',
	
	fields : [
		{ name : 'whi_dt', type : 'string' },
		{ name : 'item_cd', type : 'string' },
		{ name : 'item_nm', type : 'string' },
		{ name : 'item_tp', type : 'string' },
		{ name : 'lot_size', type : 'integer' },
		{ name : 'box_qty', type : 'integer' },
		{ name : 'lot_rqty', type : 'integer' },
		{ name : 'baseloc_cd', type : 'string' },
		{ name : 'loc_cd', type : 'string' },
		{ name : 'outbaseloc_cd', type : 'string' },
		{ name : 'outloc_cd', type : 'string' }
	],
	
	autoLoad : false,
	
	pageSize : 50,
	
	remoteFilter : false,
	
	proxy : {
		type : 'ajax',
		url : '/domains/' + login.current_domain_id + '/diy_selections/GiByMat/query.json',
		format : 'json',
		reader : {
			type : 'json',
			root: 'items',
			successProperty : 'success',
			totalProperty : 'total'
		}
	}
});
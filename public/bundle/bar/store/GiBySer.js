Ext.define('Bar.store.GiBySer', {
	
	extend : 'Ext.data.Store',
	
	fields : [
		{ name : 'whi_dt', type : 'string' },
		{ name : 'item_cd', type : 'string' },
		{ name : 'item_nm', type : 'string' },
		{ name : 'item_tp', type : 'string' },
		{ name : 'serial', type : 'string' },
		{ name : 'lot_size', type : 'integer' },
		{ name : 'lot_rqty', type : 'integer' },
		{ name : 'loc_cd', type : 'string' },
		{ name : 'loc_nm', type : 'string' },
		{ name : 'outloc_cd', type : 'string' },
		{ name : 'outloc_nm', type : 'string' }
	],
	
	autoLoad : false,
	
	pageSize : 50,
	
	remoteFilter : false,
	
	proxy : {
		type : 'ajax',
		url : '/domains/' + login.current_domain_id + '/diy_selections/GiBySer/query.json',
		format : 'json',
		reader : {
			type : 'json',
			root: 'items',
			successProperty : 'success',
			totalProperty : 'total'
		}
	}
});
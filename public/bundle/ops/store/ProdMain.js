Ext.define('Ops.store.ProdMain', {
	
	extend : 'Ext.data.Store',

	fields: [ {
		name: 'order_date'
	}, {
		name: 'shift'
	}, {
		name: 'status'
	}, {
		name: 'operation'
	}, {
		name: 'machine'
	}, {
		name: 'product'
	}, {
		name: 'operation_id'
	}, {
		name: 'product_id'
	}, {
		name: 'machine_id'
	}, {
		name: 'operation_desc'
	}, {
		name: 'product_desc'
	}, {
		name: 'machine_desc'
	}, {
		name: 'order_seq', type : 'integer'
	}, {
		name: 'actual_start_time'
	}, {
		name: 'actual_end_time'
	}, {
		name: 'order_qty', type : 'integer'
	}, {
		name: 'actual_qty', type : 'integer'
	}, {
		name: 'defect_qty', type : 'integer'
	}, {
		name: 'rework_qty', type : 'integer'
	}, {
		name: 'pallet_qty', type : 'integer'
	} ],
	
	autoLoad : false,
	
	pageSize : 5000,
	
	remoteFilter : true,
		
	proxy: {
		type : 'ajax',
		//url : '/domains/' + login.current_domain_id + '/diy_services/OpsGetOrders/query.json',
		url : '/domains/' + login.current_domain_id + '/ops/job_orders.json',
		format : 'json',
		reader : {
			type : 'json'
		}
	}
	
});
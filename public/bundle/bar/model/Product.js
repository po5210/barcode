Ext.define('Bar.model.Product', {
    
	extend: 'Ext.data.Model',
    
	fields : [
		{ name : 'id', type : 'string' },
		{ name : 'domain_id', type : 'string' },
		{ name : 'name', type : 'string' },
		{ name : 'description', type : 'string' },
		{ name : 'short_name', type : 'string' },
		{ name : 'prod_type', type : 'string' },
		{ name : 'prod_class', type : 'string' },
		{ name : 'unit', type : 'string' },
		{ name : 'default_qty', type : 'integer' },
		{ name : 'cycletime', type : 'float' },
		{ name : 'weight', type : 'float' },
		{ name : 'waste_cost', type : 'float' },
		{ name : 'flow_id', type : 'string' },
		{ name : 'customer_id', type : 'string' },
		{ name : 'cust_part_no', type : 'string' },
		{ name : 'erp_ifc_flag', type : 'integer' },
		{ name : 'useless_flag', type : 'integer' },
		{ name : 'creator_id', type : 'string' },
		{ name : 'creator', type : 'auto' },
		{ name : 'updater_id', type : 'string' },
		{ name : 'updater', type : 'auto' },
		{ name : 'created_at', type : 'date' },
		{ name : 'updated_at', type : 'date' },
		{ name : 'acct_fg', type : 'string' },
		{ name : 'odr_fg', type : 'string' },
		{ name : 'assgwh_cd', type : 'string' },
		{ name : 'assflc_cd', type : 'string' },
		{ name : 'qc_fg', type : 'string' },
		{ name : 'item_nmk', type : 'string' },
		{ name : 'item_tpk', type : 'string' },
		{ name : 'use_yn', type : 'string' },
		{ name : 'item_gb', type : 'string' },
		{ name : 'part_gcd', type : 'integer' },
		{ name : 'barcode_yn', type : 'string' },
		{ name : 'box_l', type : 'integer' },
		{ name : 'box_w', type : 'integer' },
		{ name : 'box_h', type : 'integer' },
		{ name : 'box_qty', type : 'integer' },
		{ name : 'pallet_l', type : 'integer' },
		{ name : 'pallet_h', type : 'integer' },
		{ name : 'pallet_w', type : 'integer' },
		{ name : 'pallet_row', type : 'integer' },
		{ name : 'pallet_column', type : 'integer' },
		{ name : 'pallet_layer', type : 'integer' },
		{ name : 'pallet_bqty', type : 'integer' },
		{ name : 'pallet_qty', type : 'integer' },
		{ name : 'ckdbox_l', type : 'integer' },
		{ name : 'ckdbox_w', type : 'integer' },
		{ name : 'ckdbox_h', type : 'integer' },
		{ name : 'ckdbox_qty', type : 'integer' },
		{ name : 'bar_locgrp_id', type : 'string' },
		{ name : 'bar_locgrp', type : 'auto' },
		{ name : 'bar_locmap_id', type : 'string' },
		{ name : 'bar_locmap', type : 'auto' },
		{ name : 'label_print_fg', type : 'string' },
		{ name : 'trmain_cd', type : 'string' },
		{ name : 'model_no', type : 'string' },
		{ name : 'customer_cd', type : 'string' },
		{ name : 'assy_hccd_nm', type : 'string' },
		{ name : 'cust_tr_cd', type : 'string' },
		{ name : 'cust_item_cd', type : 'string' },
		{ name : 'cust_item_nm', type : 'string' },
		{ name : 'item_tp', type : 'string' },
		{ name : 'eff_start_date', type : 'date', dateWriteFormat : T('format.submitDatetime') },
		{ name : 'eff_end_date', type : 'date', dateWriteFormat : T('format.submitDatetime') },
		{ name : 'routing', type : 'string' },
		{ name : '_cud_flag_', type : 'string' }
	],

	validations : [
		{type : 'presence', field : 'name'}
	],
	
  	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/products',
		format : 'json',
	    reader: {
			type: 'json'
        },
        writer: {
			type: 'json'
        }
	}
});
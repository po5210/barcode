Ext.define('Bar.model.BarMatmap', {
    
	extend: 'Ext.data.Model',
    
	fields : [
		{ name : 'id', type : 'string' },
		{ name : 'domain_id', type : 'string' },
		{ name : 'name', type : 'string' },
		{ name : 'description', type : 'string' },
		{ name : 'supplier_id', type : 'string' },
		{ name : 'supplier', type : 'auto' },
		{ name : 'item_tp', type : 'string' },
		{ name : 'acct_fg', type : 'string' },
		{ name : 'odr_fg', type : 'string' },
		{ name : 'assgwh_cd', type : 'string' },
		{ name : 'assflc_cd', type : 'string' },
		{ name : 'qc_fg', type : 'string' },
		{ name : 'item_nmk', type : 'string' },
		{ name : 'item_tpk', type : 'string' },
		{ name : 'use_yn', type : 'string' },
		{ name : 'str_cd', type : 'string' },
		{ name : 'str_nm', type : 'string' },
		{ name : 'unit', type : 'string' },
		{ name : 'item_gb', type : 'string' },
		{ name : 'barcode_yn', type : 'string' },
		{ name : 'box_l', type : 'integer' },
		{ name : 'part_gcd', type : 'integer' },
		{ name : 'box_w', type : 'integer' },
		{ name : 'box_h', type : 'integer' },
		{ name : 'box_qty', type : 'integer' },
		{ name : 'pallet_l', type : 'integer' },
		{ name : 'pallet_w', type : 'integer' },
		{ name : 'pallet_h', type : 'integer' },
		{ name : 'pallet_row', type : 'integer' },
		{ name : 'pallet_column', type : 'integer' },
		{ name : 'pallet_layer', type : 'integer' },
		{ name : 'pallet_bqty', type : 'integer' },
		{ name : 'pallet_qty', type : 'integer' },
		{ name : 'bar_locgrp_id', type : 'string' },
		{ name : 'bar_locgrp', type : 'auto' },
		{ name : 'bar_locmap_id', type : 'string' },
		{ name : 'bar_locmap', type : 'auto' },
		{ name : 'ckdbox_l', type : 'integer' },
		{ name : 'ckdbox_w', type : 'integer' },
		{ name : 'ckdbox_h', type : 'integer' },
		{ name : 'ckdbox_qty', type : 'integer' },
		{ name : 'label_print_fg', type : 'string' },
		{ name : 'trmain_cd', type : 'string' },
		{ name : 'model_no', type : 'string' },
		{ name : 'customer_cd', type : 'string' },
		{ name : 'assy_hccd_nm', type : 'string' },
		{ name : 'emp_cd', type : 'string' },
		{ name : 'cust_tr_cd', type : 'string' },
		{ name : 'cust_item_cd', type : 'string' },
		{ name : 'cust_item_nm', type : 'string' },
		{ name : 'creator_id', type : 'string' },
		{ name : 'creator', type : 'auto' },
		{ name : 'updater_id', type : 'string' },
		{ name : 'updater', type : 'auto' },
		{ name : 'created_at', type : 'date' },
		{ name : 'updated_at', type : 'date' },
		{ name : 'reg_ip', type : 'string' },
		{ name : 'mod_ip', type : 'string' },
		{ name : '_cud_flag_', type : 'string' }
	],

	validations : [
		{type : 'presence', field : 'name'}
	],
	
  	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/bar_matmaps',
		format : 'json',
	    reader: {
			type: 'json'
        },
        writer: {
			type: 'json'
        }
	}
});
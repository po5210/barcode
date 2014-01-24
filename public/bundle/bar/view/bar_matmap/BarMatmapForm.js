Ext.define('Bar.view.bar_matmap.BarMatmapForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'bar_bar_matmap_form',
		
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id'), hidden : true },
		{ name : 'domain_id', value : login.current_domain_id, hidden : true },
		{ name : 'name', fieldLabel : T('label.code'), allowBlank : false, maxLength : 64 },
		{ name : 'description', fieldLabel : T('label.name'), maxLength : 255 , allowBlank : false},
		{ fieldLabel : T('title.supplier'), name : 'supplier', xtype : 'entityfield', storeClass : 'Bar.store.Supplier', allowBlank : false },
		{ name : 'box_qty', fieldLabel : T('label.box_qty'), xtype : 'numberfield', allowBlank : false },
		{ fieldLabel : T('title.bar_locgrp'), name : 'bar_locgrp', xtype : 'entityfield', storeClass : 'Bar.store.BarLocgrp', allowBlank : false },
		{ fieldLabel : T('title.bar_locmap'), name : 'bar_locmap', xtype : 'entityfield', storeClass : 'Bar.store.BarLocmap' , allowBlank : false},
		{ xtype : 'datefield', name : 'created_at', disabled : true, fieldLabel : T('label.created_at'), format : T('format.datetime') },
		{ xtype : 'datefield', name : 'updated_at', disabled : true, fieldLabel : T('label.updated_at'), format : T('format.datetime') }
/*		
		{ name : 'item_tp', fieldLabel : T('label.item_tp') },
		{ name : 'acct_fg', fieldLabel : T('label.acct_fg') },
		{ name : 'odr_fg', fieldLabel : T('label.odr_fg') },
		{ name : 'assgwh_cd', fieldLabel : T('label.assgwh_cd') },
		{ name : 'assflc_cd', fieldLabel : T('label.assflc_cd') },
		{ name : 'qc_fg', fieldLabel : T('label.qc_fg') },
		{ name : 'item_nmk', fieldLabel : T('label.item_nmk') },
		{ name : 'item_tpk', fieldLabel : T('label.item_tpk') },
		{ fieldLabel : T('label.use_yn'), name : 'use_yn', xtype : 'codecombo', commonCode : 'USE_YN', displayField : 'description' },
		{ name : 'str_cd', fieldLabel : T('label.str_cd') },
		{ name : 'str_nm', fieldLabel : T('label.str_nm') },
		{ name : 'unit', fieldLabel : T('label.unit') },
		{ name : 'item_gb', fieldLabel : T('label.item_gb') },
		{ name : 'barcode_yn', fieldLabel : T('label.barcode_yn') },
		{ name : 'box_l', fieldLabel : T('label.box_l'), xtype : 'numberfield' },
		{ name : 'part_gcd', fieldLabel : T('label.part_gcd'), xtype : 'numberfield' },
		{ name : 'box_w', fieldLabel : T('label.box_w'), xtype : 'numberfield' },
		{ name : 'box_h', fieldLabel : T('label.box_h'), xtype : 'numberfield' },		
		{ name : 'pallet_l', fieldLabel : T('label.pallet_l'), xtype : 'numberfield' },
		{ name : 'pallet_w', fieldLabel : T('label.pallet_w'), xtype : 'numberfield' },
		{ name : 'pallet_h', fieldLabel : T('label.pallet_h'), xtype : 'numberfield' },
		{ name : 'pallet_row', fieldLabel : T('label.pallet_row'), xtype : 'numberfield' },
		{ name : 'pallet_column', fieldLabel : T('label.pallet_column'), xtype : 'numberfield' },
		{ name : 'pallet_layer', fieldLabel : T('label.pallet_layer'), xtype : 'numberfield' },
		{ name : 'pallet_bqty', fieldLabel : T('label.pallet_bqty'), xtype : 'numberfield' },
		{ name : 'pallet_qty', fieldLabel : T('label.pallet_qty'), xtype : 'numberfield' },
		
		{ name : 'ckdbox_l', fieldLabel : T('label.ckdbox_l'), xtype : 'numberfield' },
		{ name : 'ckdbox_w', fieldLabel : T('label.ckdbox_w'), xtype : 'numberfield' },
		{ name : 'ckdbox_h', fieldLabel : T('label.ckdbox_h'), xtype : 'numberfield' },
		{ name : 'ckdbox_qty', fieldLabel : T('label.ckdbox_qty'), xtype : 'numberfield' },
		{ name : 'label_print_fg', fieldLabel : T('label.label_print_fg') },
		{ name : 'trmain_cd', fieldLabel : T('label.trmain_cd') },
		{ name : 'model_no', fieldLabel : T('label.model_no') },
		{ name : 'customer_cd', fieldLabel : T('label.customer_cd') },
		{ name : 'assy_hccd_nm', fieldLabel : T('label.assy_hccd_nm') },
		{ name : 'emp_cd', fieldLabel : T('label.emp_cd') },
		{ name : 'cust_tr_cd', fieldLabel : T('label.cust_tr_cd') },
		{ name : 'cust_item_cd', fieldLabel : T('label.cust_item_cd') },
		{ name : 'cust_item_nm', fieldLabel : T('label.cust_item_nm') },		
		{ name : 'reg_ip', fieldLabel : T('label.reg_ip') },
		{ name : 'mod_ip', fieldLabel : T('label.mod_ip') },
*/		
	],

	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'save', 'close']
	} ]
});
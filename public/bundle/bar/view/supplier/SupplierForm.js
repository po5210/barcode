Ext.define('Bar.view.supplier.SupplierForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'bar_supplier_form',
		
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id'), hidden : true },
		{ name : 'domain_id', value : login.current_domain_id, hidden : true },
		{ name : 'name', fieldLabel : T('label.code'), allowBlank : false, maxLength : 64 },
		{ name : 'description', fieldLabel : T('label.name'), maxLength : 255 },
/*		
		{ name : 'erp_ifc_flag', fieldLabel : T('label.erp_ifc_flag'), xtype : 'numberfield' },
		{ xtype : 'datetimefield', name : 'deleted_at', fieldLabel : T('label.deleted_at'), format : T('format.date') },		
		{ name : 'version', fieldLabel : T('label.version') },
		{ name : 'supply_fg', fieldLabel : T('label.supply_fg') },
		{ name : 'reg_nb', fieldLabel : T('label.reg_nb') },
		{ name : 'ppl_nb', fieldLabel : T('label.ppl_nb') },
		{ name : 'ceo_nm', fieldLabel : T('label.ceo_nm') },
		{ name : 'business', fieldLabel : T('label.business') },
		{ name : 'jongmok', fieldLabel : T('label.jongmok') },
		{ name : 'zip', fieldLabel : T('label.zip') },
		{ name : 'div_addr1', fieldLabel : T('label.div_addr1') },
		{ name : 'addr2', fieldLabel : T('label.addr2') },
		{ name : 'ddd', fieldLabel : T('label.ddd') },
		{ name : 'tel', fieldLabel : T('label.tel') },
		{ name : 'fax', fieldLabel : T('label.fax') },
		{ name : 'use_yn', fieldLabel : T('label.use_yn') },
*/		
		{ xtype : 'datefield', name : 'created_at', disabled : true, fieldLabel : T('label.created_at'), format : T('format.datetime') },
		{ xtype : 'datefield', name : 'updated_at', disabled : true, fieldLabel : T('label.updated_at'), format : T('format.datetime') },
	],

	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'save', 'close']
	} ]
});
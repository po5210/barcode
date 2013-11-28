Ext.define('Bar.view.loc.LocForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'bar_loc_form',
		
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id'), hidden : true },
		{ name : 'domain_id', value : login.current_domain_id, hidden : true },
		{ name : 'name', fieldLabel : T('label.code'), allowBlank : false, maxLength : 4 },
		{ name : 'description', fieldLabel : T('label.name'), maxLength : 30 },
		{ fieldLabel : T('title.baseloc'), name : 'baseloc', xtype : 'entityfield', storeClass : 'Bar.store.Baseloc', allowBlank : false },
		{ name : 'loc_nmk', fieldLabel : T('label.loc_nmk'), maxLength : 30 },
		{ fieldLabel : T('label.prod_line_fg'), name : 'prod_line_fg', xtype : 'codecombo', commonCode : 'PROD_LINE_TYPE', displayField : 'description' },
		{ name : 'erp_bloc', fieldLabel : T('label.erp_bloc'), maxLength : 4 },
		{ name : 'erp_loc', fieldLabel : T('label.erp_loc'), maxLength : 4 },
		{ name : 'tmp_bloc', fieldLabel : T('label.tmp_bloc'), maxLength : 4 },
		{ name : 'tmp_loc', fieldLabel : T('label.tmp_loc'), maxLength : 4 },
		{ fieldLabel : T('label.use_yn'), name : 'use_yn', xtype : 'codecombo', commonCode : 'USE_YN', displayField : 'description' },
		{ xtype : 'datefield', name : 'created_at', disabled : true, fieldLabel : T('label.created_at'), format : T('format.datetime') },
		{ xtype : 'datefield', name : 'updated_at', disabled : true, fieldLabel : T('label.updated_at'), format : T('format.datetime') },
	],

	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'save', 'close']
	} ]
});
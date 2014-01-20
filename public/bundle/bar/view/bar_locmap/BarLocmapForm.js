Ext.define('Bar.view.bar_locmap.BarLocmapForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'bar_bar_locmap_form',
		
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id'), hidden : true },
		{ name : 'domain_id', value : login.current_domain_id, hidden : true },
		{ name : 'baseloc_cd', fieldLabel : T('label.baseloc_cd') },
		{ name : 'name', fieldLabel : T('label.name'), allowBlank : false, maxLength : 64 },
		{ name : 'description', fieldLabel : T('label.description'), maxLength : 255 },
		{ name : 'loc_nmk', fieldLabel : T('label.loc_nmk') },
		{ name : 'loc_cd', fieldLabel : T('label.loc_cd') },
		{ fieldLabel : T('label.use_yn'), name : 'use_yn', xtype : 'codecombo', commonCode : 'USE_YN', displayField : 'description' },
		{ xtype : 'datefield', name : 'created_at', disabled : true, fieldLabel : T('label.created_at'), format : T('format.datetime') },
		{ xtype : 'datefield', name : 'updated_at', disabled : true, fieldLabel : T('label.updated_at'), format : T('format.datetime') },
		{ fieldLabel : T('label.prod_line_fg'), name : 'prod_line_fg', xtype : 'codecombo', commonCode : 'LOC_TYPE', displayField : 'description' },
		{ name : 'erp_bloc', fieldLabel : T('label.erp_bloc') },
		{ name : 'erp_loc', fieldLabel : T('label.erp_loc') },
		{ name : 'tmp_bloc', fieldLabel : T('label.tmp_bloc') },
		{ name : 'tmp_loc', fieldLabel : T('label.tmp_loc') },
		{ name : 'reg_ip', fieldLabel : T('label.reg_ip') },
		{ name : 'mod_ip', fieldLabel : T('label.mod_ip') },
	],

	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'save', 'close']
	} ]
});
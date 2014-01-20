Ext.define('Bar.view.loc.LocForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'bar_loc_form',
		
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'baseloc_cd', fieldLabel : T('label.baseloc_cd') },
		{ name : 'loc_cd', fieldLabel : T('label.loc_cd') },
		{ name : 'loc_nm', fieldLabel : T('label.loc_nm') },
		{ name : 'loc_nmk', fieldLabel : T('label.loc_nmk') },
		{ name : 'loc_dc', fieldLabel : T('label.loc_dc') },
		{ name : 'use_yn', fieldLabel : T('label.use_yn') },
		{ name : 'reg_id', fieldLabel : T('label.reg_id') },
		{ name : 'reg_dtm', fieldLabel : T('label.reg_dtm') },
		{ name : 'mod_id', fieldLabel : T('label.mod_id') },
		{ name : 'mod_dtm', fieldLabel : T('label.mod_dtm') },
		{ name : 'prod_line_fg', fieldLabel : T('label.prod_line_fg') },
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
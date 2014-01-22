Ext.define('Bar.view.bar_locgrp.BarLocgrpForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'bar_bar_locgrp_form',
		
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id'), hidden : true },
		{ name : 'domain_id', value : login.current_domain_id, hidden : true },
		{ name : 'name', fieldLabel : T('label.code'), allowBlank : false, maxLength : 64 },
		{ name : 'description', fieldLabel : T('label.name'), maxLength : 255 },
/*		
		{ name : 'baseloc_fg', fieldLabel : T('label.baseloc_fg') },
		{ name : 'div_cd', fieldLabel : T('label.div_cd') },
		{ name : 'inloc_cd', fieldLabel : T('label.inloc_cd') },
		{ name : 'outloc_cd', fieldLabel : T('label.outloc_cd') },
		{ name : 'baseloc_nmk', fieldLabel : T('label.baseloc_nmk') },
*/	
		{ fieldLabel : T('label.use_yn'), name : 'use_yn', xtype : 'codecombo', commonCode : 'USE_YN', displayField : 'description' },
		{ xtype : 'datefield', name : 'created_at', disabled : true, fieldLabel : T('label.created_at'), format : T('format.datetime') },
		{ xtype : 'datefield', name : 'updated_at', disabled : true, fieldLabel : T('label.updated_at'), format : T('format.datetime') },
	],

	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'save', 'close']
	} ]
});
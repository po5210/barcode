Ext.define('Bar.view.baseloc.BaselocForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'bar_baseloc_form',
		
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id'), hidden : true },
		{ name : 'domain_id', value : login.current_domain_id, hidden : true },
		{ name : 'baseloc_cd', fieldLabel : T('label.baseloc_cd') },
		{ name : 'baseloc_nm', fieldLabel : T('label.baseloc_nm') },
		{ name : 'baseloc_fg', fieldLabel : T('label.baseloc_fg') },
		{ name : 'div_cd', fieldLabel : T('label.div_cd') },
		{ name : 'inloc_cd', fieldLabel : T('label.inloc_cd') },
		{ name : 'outloc_cd', fieldLabel : T('label.outloc_cd') },
		{ name : 'baseloc_nmk', fieldLabel : T('label.baseloc_nmk') },
		{ fieldLabel : T('label.use_yn'), name : 'use_yn', xtype : 'codecombo', commonCode : 'USE_YN', displayField : 'description' },
	],

	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'save', 'close']
	} ]
});
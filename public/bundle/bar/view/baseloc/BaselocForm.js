Ext.define('Bar.view.baseloc.BaselocForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'bar_baseloc_form',
		
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id'), hidden : true },
		{ name : 'domain_id', value : login.current_domain_id, hidden : true },
		{ name : 'name', fieldLabel : T('label.code'), maxLength : 4, allowBlank : false },
		{ name : 'description', fieldLabel : T('label.name'), maxLength : 30 },
		{ name : 'baseloc_fg', fieldLabel : T('label.baseloc_fg'), xtype : 'codecombo', commonCode : 'WH_TYPE', allowBlank : false },
		{ name : 'div_cd', fieldLabel : T('label.div_cd'), maxLength : 4 },
		{ name : 'inloc_cd', fieldLabel : T('label.inloc_cd'), maxLength : 4 },
		{ name : 'outloc_cd', fieldLabel : T('label.outloc_cd'), maxLength : 4 },
		{ name : 'baseloc_nmk', fieldLabel : T('label.baseloc_nmk'), maxLength : 30 },
		{ fieldLabel : T('label.use_yn'), name : 'use_yn', xtype : 'codecombo', commonCode : 'USE_YN', displayField : 'description' },
	],

	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'save', 'close']
	} ]
});
Ext.define('Bar.view.trade.TradeForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'bar_trade_form',
		
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id'), hidden : true },
		{ name : 'domain_id', value : login.current_domain_id, hidden : true },
		{ name : 'tr_cd', fieldLabel : T('label.tr_cd'), allowBlank : false, maxLength : 5 },
		{ name : 'tr_nm', fieldLabel : T('label.tr_nm'), allowBlank : false, maxLength : 60 },
		{ name : 'attr_nm', fieldLabel : T('label.attr_nm') },
		{ name : 'tr_fg', fieldLabel : T('label.tr_fg') },
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
		{ name : 'tr_nmk', fieldLabel : T('label.tr_nmk') },
		{ name : 'attr_nmk', fieldLabel : T('label.attr_nmk') },
		{ name : 'ceo_nmk', fieldLabel : T('label.ceo_nmk') },
		{ fieldLabel : T('label.use_yn'), name : 'use_yn', xtype : 'codecombo', commonCode : 'USE_YN', displayField : 'description' },
		{ xtype : 'datefield', name : 'created_at', disabled : true, fieldLabel : T('label.created_at'), format : T('format.datetime') },
		{ xtype : 'datefield', name : 'updated_at', disabled : true, fieldLabel : T('label.updated_at'), format : T('format.datetime') },
	],

	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'save', 'close']
	} ]
});
Ext.define('Bar.view.trade.TradeForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'bar_trade_form',
		
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id'), hidden : true },
		{ 
			xtype: 'container',
			layout: 'hbox',
			items : [ {
				xtype: 'container',
				flex : 1,
				layout : 'anchor',
				defaults: {
					anchor : '90%'
				},
			    items: [
					{ name : 'tr_cd', xtype : 'textfield', fieldLabel : T('label.code'), allowBlank : false, maxLength : 5 },
					{ name : 'attr_nm', xtype : 'textfield', fieldLabel : T('label.attr_nm'), maxLength : 60 },
					{ name : 'tr_fg', xtype : 'textfield', fieldLabel : T('label.tr_fg'), allowBlank : false },
					{ name : 'reg_nb', xtype : 'textfield', fieldLabel : T('label.reg_nb'), maxLength : 30 },
					{ name : 'ppl_nb', xtype : 'textfield', fieldLabel : T('label.ppl_nb'), maxLength : 20 },
					{ name : 'ceo_nm', xtype : 'textfield', fieldLabel : T('label.ceo_nm'), maxLength : 30 },
					{ name : 'business', xtype : 'textfield', fieldLabel : T('label.business'), maxLength : 45 },
					{ name : 'jongmok', xtype : 'textfield', fieldLabel : T('label.jongmok'), maxLength : 45 },
					{ name : 'zip', xtype : 'textfield', fieldLabel : T('label.zip'), maxLength : 7 }
				]
			}, {
				xtype: 'container',
				flex : 1,
				layout : 'anchor',
				defaults: {
					anchor : '100%'
				},
				items: [
					{ name : 'tr_nm', xtype : 'textfield', fieldLabel : T('label.name'), maxLength : 60 },
					{ name : 'div_addr1', xtype : 'textfield', fieldLabel : T('label.div_addr1'), maxLength : 90 },
					{ name : 'addr2', xtype : 'textfield', fieldLabel : T('label.addr2'), maxLength : 30 },
					{ name : 'ddd', xtype : 'textfield', fieldLabel : T('label.ddd'), maxLength : 4 },
					{ name : 'tel', xtype : 'textfield', fieldLabel : T('label.tel'), maxLength : 12 },
					{ name : 'fax', xtype : 'textfield', fieldLabel : T('label.fax'), maxLength : 12 },
					{ name : 'tr_nmk', xtype : 'textfield', fieldLabel : T('label.tr_nmk'), maxLength : 60 },
					{ name : 'attr_nmk', xtype : 'textfield', fieldLabel : T('label.attr_nmk'), maxLength : 60 },
					{ name : 'ceo_nmk', xtype : 'textfield', fieldLabel : T('label.ceo_nmk'), maxLength : 30 },					
				]
			} ]
		}, 

		{ fieldLabel : T('label.use_yn'), name : 'use_yn', xtype : 'codecombo', commonCode : 'YES_NO', displayField : 'description' },
		//{ xtype : 'datefield', name : 'created_at', disabled : true, fieldLabel : T('label.created_at'), format : T('format.datetime') },
		//{ xtype : 'datefield', name : 'updated_at', disabled : true, fieldLabel : T('label.updated_at'), format : T('format.datetime') },
	],

	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'save', 'close']
	} ]
});
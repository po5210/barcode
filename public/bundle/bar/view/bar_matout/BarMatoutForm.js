Ext.define('Bar.view.bar_matout.BarMatoutForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'bar_bar_matout_form',
		
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id'), hidden : true },
		{ name : 'domain_id', value : login.current_domain_id, hidden : true },
		{ name : 'name', fieldLabel : T('label.name'), allowBlank : false, maxLength : 64 },
		{ name : 'description', fieldLabel : T('label.description'), maxLength : 255 },
		{ name : 'who_dt', fieldLabel : T('label.who_dt') },
		{ name : 'who_sq', fieldLabel : T('label.who_sq'), xtype : 'numberfield' },
		{ name : 'who_fg', fieldLabel : T('label.who_fg') },
		{ name : 'lot_qty', fieldLabel : T('label.lot_qty'), xtype : 'numberfield' },
		{ name : 'lot_rqty', fieldLabel : T('label.lot_rqty'), xtype : 'numberfield' },
		{ name : 'item_cd', fieldLabel : T('label.item_cd') },
		{ fieldLabel : T('title.bar_locgrp'), name : 'bar_locgrp', xtype : 'entityfield', storeClass : 'Bar.store.BarLocgrp' },
		{ fieldLabel : T('title.bar_locmap'), name : 'bar_locmap', xtype : 'entityfield', storeClass : 'Bar.store.BarLocmap' },
		{ name : 'outbaseloc_cd', fieldLabel : T('label.outbaseloc_cd') },
		{ name : 'outloc_cd', fieldLabel : T('label.outloc_cd') },
		{ xtype : 'datefield', name : 'created_at', disabled : true, fieldLabel : T('label.created_at'), format : T('format.datetime') },
		{ xtype : 'datefield', name : 'updated_at', disabled : true, fieldLabel : T('label.updated_at'), format : T('format.datetime') },
		{ name : 'created_ip', fieldLabel : T('label.created_ip') },
		{ name : 'updated_ip', fieldLabel : T('label.updated_ip') },
		{ name : 'whi_dt', fieldLabel : T('label.whi_dt') },
		{ name : 'whi_sq', fieldLabel : T('label.whi_sq'), xtype : 'numberfield' },
		{ name : 'lot_no', fieldLabel : T('label.lot_no') },
		{ name : 'ser_no', fieldLabel : T('label.ser_no') },
		{ name : 'internal_issue_no', fieldLabel : T('label.internal_issue_no') },
		{ name : '26', fieldLabel : T('label.26') },
		{ name : '27', fieldLabel : T('label.27') },
		{ name : '28', fieldLabel : T('label.28') },
		{ name : '29', fieldLabel : T('label.29') },
	],

	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'save', 'close']
	} ]
});
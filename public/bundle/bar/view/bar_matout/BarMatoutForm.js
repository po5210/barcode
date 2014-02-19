Ext.define('Bar.view.bar_matout.BarMatoutForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'bar_bar_matout_form',
		
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [],	

	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'apply_invoice', 'new', 'save', 'delete', 'print', 'import']
	} ]
});
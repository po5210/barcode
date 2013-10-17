Ext.define('Base.view.domain.DomainShiftForm', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'base_domain_shift_form',
	
	title : T('title.shift'),
	
	autoScroll : true,
	
	defaults : { xtype : 'textfield', anchor : '100%' },
	
	items : [
		{ name : 'id', fieldLabel : T('label.id'), hidden : true },
		{ name : 'domain_id', value : login.current_domain_id, hidden : true },
		{ name : 'total_shift', fieldLabel : T('label.total_shift') },
		{ name : 'shift1_start', fieldLabel : T('label.shiftx_start', {x : '1'}) },
		{ name : 'shift1_end', fieldLabel : T('label.shiftx_end', {x : '1'}) },
		{ name : 'shift2_start', fieldLabel : T('label.shiftx_start', {x : '2'}) },
		{ name : 'shift2_end', fieldLabel : T('label.shiftx_end', {x : '2'}) },
		{ name : 'shift3_start', fieldLabel : T('label.shiftx_start', {x : '3'}) },
		{ name : 'shift3_end', fieldLabel : T('label.shiftx_end', {x : '3'}) }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'save']
	} ]
});
Ext.define('Base.view.entity.EntityForm', {

	extend : 'Ext.form.Panel',

	xtype : 'base_entity_form',

	title : T('title.details'),

	autoScroll : true,

	defaults : { xtype : 'textfield', anchor : '100%' },

	items : [
		{ name : 'id', fieldLabel : T('label.id'), hidden : true },
		{ name : 'domain_id', value : login.current_domain_id, hidden : true },
		{ name : 'name', fieldLabel : T('label.name') },
		{ name : 'description', fieldLabel : T('label.description') },
		{ name : 'bundle', fieldLabel : T('label.bundle') },
		{ xtype : 'datefield', name : 'created_at', disabled : true, fieldLabel : T('label.created_at'), format : T('format.datetime') },
		{ xtype : 'datefield', name : 'updated_at', disabled : true, fieldLabel : T('label.updated_at'), format : T('format.datetime') }
	],

	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'back', 'save', 'delete', 'generate_api', 'generate_table', 'generate_view']
	} ]
});
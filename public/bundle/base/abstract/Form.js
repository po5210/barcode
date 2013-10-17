Ext.define('Base.abstract.Form', {
	extend : 'Ext.form.Panel',
	
	xtype : 'base_form',
	
	autoScroll : true,
	
	mixins : {
		spotlink : 'mixin.SpotLink'
	}
});
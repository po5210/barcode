Ext.define('Base.abstract.TabPanel', {
	
	extend : 'Ext.tab.Panel',
	
	xtype : 'base_tabpanel',
	
	mixins : {
		spotlink : 'mixin.SpotLink'
	}
	
});
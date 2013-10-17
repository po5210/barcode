Ext.define('Base.abstract.Panel', {
	extend : 'Ext.panel.Panel',
	
	xtype : 'base_panel',
	
	autoScroll : true,
	
	mixins : {
		spotlink : 'mixin.SpotLink'
	},
	
	initComponent : function() {
		this.callParent();

		if(this.searchView) {
			this.addDocked({
				dock : 'top',
				xtype : this.searchView
			});
		}
	}
});
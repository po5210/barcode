Ext.define('App.view.TopBar', {
	extend : 'Ext.toolbar.Toolbar',
	
	xtype : 'topbar',
	
	items : [ '->' ],
	
	initComponent : function() {
		this.callParent();
		
		this.add([{
			text : T('button.operating_studio'),
			id : 'linkto_ops',
			cls : 'sideOPS'
		}, {
			text : T('button.logout'),
			id : 'logout',
			cls : 'sideLogout'
		}]);
		
		Ext.Array.each(HF.custom.topbar(), function(component) {
			try {
				this.insert(1, component);
			} catch (e) {
				HF.error(T('error.CUSTOM-TOPBAR-FAILURE', {
					view : component
				}), e);
			}
		}, this);
	}
});

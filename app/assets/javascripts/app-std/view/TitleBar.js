Ext.define('App.view.TitleBar', {
	extend : 'Ext.toolbar.Toolbar',
	
	xtype : 'titlebar',
	
	items : [ {
		xtype : 'label',
		id : 'title'
	}, '->' ],
	
	initComponent : function() {
		this.callParent();
		
		Ext.Array.each(HF.custom.titlebar(), function(component) {
			try {
				this.add(component);
			} catch (e) {
				HF.error(T('error.CUSTOM-TITLEBAR-FAILURE', {
					view : component
				}), e);
			}
		}, this);
	}
});
Ext.define('Base.abstract.TabPanelController', {
	
	extend : 'Ext.app.Controller',
	
	onClickClose : function(view) {
		view.close();
	}
});

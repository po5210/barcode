Ext.define('Base.abstract.PanelController', {
	extend : 'Ext.app.Controller',
	
	onClickClose : function(view) {
		view.close();
	}
});

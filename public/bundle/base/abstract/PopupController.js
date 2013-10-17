Ext.define('Base.abstract.PopupController', {
	extend : 'Ext.app.Controller',
	
	onClickClose : function(view) {
		view.close();
	}
});

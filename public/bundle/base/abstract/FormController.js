Ext.define('Base.abstract.FormController', {
	extend : 'Ext.app.Controller',
	
	onClickClose : function(view) {
		view.close();
	}
});

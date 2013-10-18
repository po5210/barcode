Ext.define('Bops.controller.BopsController', {
	extend: 'Ext.app.Controller',

	requires: [],

	stores: [],
	
	models: [],

	views: [],

	controllers: [],

	init: function() {
		var self = this;

		Ext.each(this.controllers, function(ctl) {
			self.getController('Bops.controller.' + ctl);
		});

		this.control({
		});
	}
});

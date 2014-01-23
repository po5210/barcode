Ext.define('Bar.controller.BarController', {
	extend: 'Ext.app.Controller',

	requires: [],

	stores: [],
	
	models: [],

	views: [],

	controllers: [],

	init: function() {
		var self = this;

		Ext.each(this.controllers, function(ctl) {
			self.getController('Bar.controller.' + ctl);
		});

		this.control({
		});
		
		HF.mixin('mixin.WsClient');
	}
});

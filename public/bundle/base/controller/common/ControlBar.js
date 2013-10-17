Ext.define('Base.controller.common.ControlBar', {
	extend : 'Ext.app.Controller',

	views : [ 'Base.view.common.ControlBar' ],

	init : function() {
		this.control({
			'controlbar button' : {
				click : this.onButtonClicked
			}
		});
	},
	
	onButtonClicked : function(button) {		
		var owner = button.up('controlbar').getOwner();

		if(button.itemId) {
			owner.fireEvent('click_' + button.itemId, owner);
		}
	}
});
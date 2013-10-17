Ext.define('Base.controller.menu.MenuBar', {
	extend : 'Ext.app.Controller',
	
	views : ['Base.view.menu.MenuBar'],
	
	refs : [ {
		selector : 'base_menubar',
		ref : 'menuBar'
	} ],
	
	init : function() {
		this.control({
			'base_menubar dataview' : {
				itemclick : this.onItemClick
			}
		});
	},
	
	onItemClick : function(view, record, item) {
		if(!record.get('template'))
			return;
		
		HF.show(record.get('template'));
		this.getMenuBar().close();
	}
});
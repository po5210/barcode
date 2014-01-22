Ext.define('Bar.view.bar_matmap.BarMatmapDetail', {
	
	extend : 'Base.abstract.Popup',
	
 	requires : [ 
		'Bar.view.bar_matmap.BarMatmapForm'
	],
	
	xtype : 'bar_bar_matmap_detail',
	
	title : T('menu.BarMatmap'),
		
	items : [ {
		xtype : 'bar_bar_matmap_form'
	} ],
	
	setRecord : function(record) {
		this.record = record;
		this.down('form').loadRecord(this.record);
	},
	
	getRecord : function() {
		return this.record;
	}
});
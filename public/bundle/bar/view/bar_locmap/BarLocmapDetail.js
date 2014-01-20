Ext.define('Bar.view.bar_locmap.BarLocmapDetail', {
	
	extend : 'Base.abstract.Popup',
	
 	requires : [ 
		'Bar.view.bar_locmap.BarLocmapForm'
	],
	
	xtype : 'bar_bar_locmap_detail',
	
	title : T('menu.BarLocmap'),
		
	items : [ {
		xtype : 'bar_bar_locmap_form'
	} ],
	
	setRecord : function(record) {
		this.record = record;
		this.down('form').loadRecord(this.record);
	},
	
	getRecord : function() {
		return this.record;
	}
});
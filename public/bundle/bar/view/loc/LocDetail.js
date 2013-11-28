Ext.define('Bar.view.loc.LocDetail', {
	
	extend : 'Base.abstract.Popup',
	
 	requires : [ 
		'Bar.view.loc.LocForm'
	],
	
	xtype : 'bar_loc_detail',
	
	height : 560,
	
	title : T('menu.Loc'),
		
	items : [ {
		xtype : 'bar_loc_form'
	} ],
	
	setRecord : function(record) {
		this.record = record;
		this.down('form').loadRecord(this.record);
	},
	
	getRecord : function() {
		return this.record;
	}
});
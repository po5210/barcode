Ext.define('Bar.view.bar_matout.BarMatoutDetail', {
	
	extend : 'Base.abstract.Popup',
	
 	requires : [ 
		'Bar.view.bar_matout.BarMatoutForm'
	],
	
	xtype : 'bar_bar_matout_detail',
	
	title : T('menu.BarMatout'),
		
	items : [ {
		xtype : 'bar_bar_matout_form'
	} ],
	
	setRecord : function(record) {
		this.record = record;
		this.down('form').loadRecord(this.record);
	},
	
	getRecord : function() {
		return this.record;
	}
});
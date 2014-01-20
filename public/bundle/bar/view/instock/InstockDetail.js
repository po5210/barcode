Ext.define('Bar.view.instock.InstockDetail', {
	
	extend : 'Base.abstract.Popup',
	
 	requires : [ 
		'Bar.view.instock.InstockForm'
	],
	
	xtype : 'bar_instock_detail',
	
	height : 560,
	
	title : T('menu.Instock'),
		
	items : [ {
		xtype : 'bar_Instock_form'
	} ],
	
	setRecord : function(record) {
		this.record = record;
		this.down('form').loadRecord(this.record);
	},
	
	getRecord : function() {
		return this.record;
	}
});
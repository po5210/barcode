Ext.define('Bar.view.baseloc.BaselocDetail', {
	
	extend : 'Base.abstract.Popup',
	
 	requires : [ 
		'Bar.view.baseloc.BaselocForm'
	],
	
	xtype : 'bar_baseloc_detail',
	
	title : T('menu.Baseloc'),
		
	items : [ {
		xtype : 'bar_baseloc_form'
	} ],
	
	setRecord : function(record) {
		this.record = record;
		this.down('form').loadRecord(this.record);
	},
	
	getRecord : function() {
		return this.record;
	}
});
Ext.define('Base.view.terminology.TerminologyDetail', {
	
	extend : 'Base.abstract.Popup',
	
 	requires : [ 
		'Base.view.terminology.TerminologyForm'
	],
	
	xtype : 'base_terminology_detail',
	
	title : T('title.terminology'),
		
	items : [ {
		xtype : 'base_terminology_form'
	} ],
	
	width : 700,
	
	height : 520,
	
	setRecord : function(record) {
		this.record = record;
		this.down('form').loadRecord(this.record);
	},
	
	getRecord : function() {
		return this.record;
	}
});

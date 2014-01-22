Ext.define('Bar.view.part_group.PartGroupDetail', {
	
	extend : 'Base.abstract.Popup',
	
 	requires : [ 
		'Bar.view.part_group.PartGroupForm'
	],
	
	xtype : 'bar_part_group_detail',
	
	title : T('menu.PartGroup'),
		
	items : [ {
		xtype : 'bar_part_group_form'
	} ],
	
	setRecord : function(record) {
		this.record = record;
		this.down('form').loadRecord(this.record);
	},
	
	getRecord : function() {
		return this.record;
	}
});
Ext.define('Base.view.entity.EntityDetail', {

	extend : 'Base.abstract.entity.DetailMainView',

 	requires : [ 
		'Base.view.entity.EntityForm',
		'Base.view.entity.EntityColumnList'
	],

	xtype : 'base_entity_detail',

	title : T('title.entity_details', {entity : T('title.entity')}),

	items : [ {
		xtype : 'base_entity_form'
	}, {
		xtype : 'base_entity_column_list'
	} ],

	setRecord : function(record) {
		this.record = record;
		HF.setTitle(T('title.entity') + ' ' + this.record.get('name'));
		this.down('form').loadRecord(this.record);
	},

	getRecord : function() {
		return this.record;
	}
});
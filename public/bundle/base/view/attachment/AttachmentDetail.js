Ext.define('Base.view.attachment.AttachmentDetail', {
	
	extend : 'Base.abstract.Popup',
	
 	requires : [ 
		'Base.view.attachment.AttachmentForm'
	],
	
	xtype : 'base_attachment_detail',
	
	title : T('title.entity_details', {entity : T('title.attachment')}),
	
	items : [ {
		xtype : 'base_attachment_form'
	} ],
	
	setRecord : function(record) {
		this.record = record;
		this.down('form').loadRecord(this.record);
	},
	
	getRecord : function() {
		return this.record;
	}
});

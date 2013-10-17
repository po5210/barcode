Ext.define('Base.view.attachment.AttachmentSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'base_attachment_search',
		
	items : [ 
		{ fieldLabel : T('label.name'), name : 'name-like' },
		{ fieldLabel : T('label.description'), name : 'description-like' }
	]
	
});
Ext.define('Base.view.attachment.Attachment', {
	
	extend: 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'Base.view.attachment.AttachmentSearch',
		'Base.view.attachment.AttachmentList'
	],
	
	xtype : 'base_attachment',
	
	title : T('title.attachment'),
	
	searchView : 'base_attachment_search',
	
	gridView : 'base_attachment_list'
	
});
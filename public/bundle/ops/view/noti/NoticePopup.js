Ext.define('Ops.view.noti.NoticePopup', {
	
	extend : 'Base.abstract.Popup',
	
	xtype : 'ops_noti_popup',
	
	title : T('title.notice'),
	
	width : 700,
	
	height : 420,
	
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	
	dockedItems : [ {
		xtype : 'controlbar',
		items : ['->', 'confirm']
	} ],
	
	items: [ { 
		layout : 'column',
		xtype : 'panel',
		defaultType : 'displayfield',
		cls : 'infoFields2Column',
		items : [ {
			fieldLabel : T('label.work_date'),
			itemId : 'work_date'
		}, {
			xtype : 'displayfield',
			fieldLabel : T('label.time'),
			itemId : 'created_at'
		}, {
			fieldLabel : T('label.operation'),
			itemId : 'operation'
		}, {
			fieldLabel : T('label.operation_desc'),
			itemId : 'operation_desc'
		} ]
	}, {
		cls : 'marginT10 marginB10',
		xtype : 'textareafield',
		itemId : 'msg',
		fieldLabel : T('label.message'),
		labelAlign : 'top',
		readOnly : true,
		flex : 1
	} ]
});
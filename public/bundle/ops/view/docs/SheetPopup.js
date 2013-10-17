Ext.define('Ops.view.docs.SheetPopup', {
	
	extend : 'Base.abstract.Popup',
	
	xtype : 'ops_docs_popup',
	
	title : T('menu.TmDocs'),
	
	width : 1000,
	
	height : 720,
	
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	
	items : [{
		xtype : 'panel',
		layout : 'column',
		cls : 'infoFields2Column',
		defaultType : 'displayfield',
		flex : 1,
		items : [ {
			fieldLabel : T('label.wc'),
			itemId : 'workcenter',
			flex : 1
		}, {
			fieldLabel : T('label.operation'),
			itemId : 'operation',
			flex : 1
		}, {
			xtype : 'displayfield',
			fieldLabel : T('label.title'),
			itemId : 'title',
			flex : 1
		}, {
			xtype : 'displayfield',
			fieldLabel : T('label.created_at'),
			itemId : 'reg_date',
			flex : 1
		} ]
	}, {
		xtype : 'container',
		html : '<br/>'
	}, {
		xtype : 'container',
		flex : 1,
		items : [ {
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			xtype : 'panel',
			flex : 1,
			items : [ {
				xtype : 'image',
				src : 'theme/imageOPS/kanoss.png',
				height : 550
			} ]
		} ]
	} ]
});
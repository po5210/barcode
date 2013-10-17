Ext.define('App.view.Viewport', {
	extend : 'Ext.container.Viewport',
	
	requires : 'Ext.ux.statusbar.StatusBar',

	layout : 'border',
	
	id : 'viewport',
	
	items : [ {
		xtype : 'container',
		region : 'north',
		height : 60,
		layout : {
			type : 'hbox',
			align : 'stretch'
		},
		items : [{
			xtype : 'component',
			id : 'brandbar',
			width : 170
		}, {
			xtype : 'container',
			flex : 1,
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [{
				xtype : 'topbar',
				id : 'topbar',
				flex : 1
			}, {
				xtype : 'ribonbar',
				id : 'ribonbar',
				flex : 1
			}]
		}]
	}, {
		xtype : 'container',
		id : 'navcnt',
		region : 'west',
		width : 170,
		layout : {
			type : 'vbox',
			align : 'stretch'
		},
		items : [{
			xtype : 'navbar',
			id : 'navbar',
			flex : 1,
			vertical : true
		}]
	}, {
		xtype : 'sidebar',
		id : 'sidebar',
		cls : 'sidebar',
		region : 'east',
		vertical : true,
		width : 200
	}, {
		xtype : 'container',
		region : 'south',
		cls : 'statusBar',
		height : 35,
		layout : {
			type : 'hbox',
			align : 'middle'
		},
		items : [{
			xtype : 'progressbar',
			id : 'progressbar'
		}, {
			xtype : 'statusbar',
			id : 'statusbar',
			flex : 1,
			autoClear : 7000,
			defaultText : '',
			listeners : {
				afterrender : function(view) {
					view.setText(T('text.Welcome Ment'))
				}
			}
		}]
	}, {
		region : 'south',
		hidden : true,
		xtype : 'downloader',
		id : 'downloader'
	}, {
		region : 'south',
		hidden : true,
		xtype : 'component',
		tpl : [
		'<tpl for=".">',
		'<a href="{path.path.url}" class="slide" title="{name}">{name}</a>',
		'</tpl>'
		],
		id : 'slideshowbar'
	}, {
		xtype : 'panel',
		region : 'center',
		layout : 'card',
		id : 'content',
		dockedItems : [{
			xtype : 'titlebar',
			id : 'titlebar',
			cls : 'titlebar',
			dock : 'top',
			height : 30
		}]
	} ]
});

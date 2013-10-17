 Ext.define('App.view.Viewport', {
	extend : 'Ext.container.Viewport',

	requires : 'Ext.ux.statusbar.StatusBar',
	
	id : 'viewport',

	layout : 'border',
	
	items : [ {
		xtype : 'container',
		region : 'north',
		layout : {
			type : 'hbox',
			align : 'stretch'
		},
		items : [ {
			xtype : 'container',
			id : 'brandbar',
			width : 250
		}, {
			xtype : 'container',
			flex : 1,
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [ {
				xtype : 'topbar',
				id : 'topbar',
				height : 25
			}, {
				xtype : 'optionbar',
				id : 'optionbar',
				height : 45
			} ]
		} ]
	}, {
		xtype : 'container',
		layout : 'border',
		region : 'center',
		items : [{
			xtype : 'panel',
			id : 'navbar',
			region : 'west',
			layout : 'card',
			width : 100,
			items : [{
				xtype : 'favoritebar',
				id : 'favoritebar',
				vertical : true
			}], 
			dockedItems : [{
				xtype : 'button',
				view : 'Base.view.favorite.Favorite',
				cls : 'btnFavoriteMore',
				dock : 'bottom',
				listeners : {
					afterrender : function(button) {
						Ext.defer(function() {
							if(Ext.getStore('Favorite').getCount() === 0) {
								HF.msg.tip(T('text.Setup Favorites First'), button);
							}
						}, 1000);
					}
				}
			}]
		}, {
			xtype : 'panel',
			region : 'center',
			layout : 'card',
			id : 'content',
			dockedItems : [{
				xtype : 'titlebar',
				id : 'titlebar',
				dock : 'top',
				height : 30
			}]
		}]
	}, {
		xtype : 'container',
		region : 'south',
		height : 40,
		layout : {
			type : 'hbox',
			align : 'middle'
		},
		items : [{
			xtype : 'progressbar',
			id : 'progressbar',
			width : 140
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
		xtype : 'component',
		tpl : [
		'<tpl for=".">',
		'<a href="{path.path.url}" class="slide" title="{name}">{name}</a>',
		'</tpl>'
		],
		id : 'slideshowbar'
	}, {
		region : 'south',
		hidden : true,
		xtype : 'downloader',
		id : 'downloader'
	} ]
});

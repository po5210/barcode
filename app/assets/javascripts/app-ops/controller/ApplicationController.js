Ext.define('App.controller.ApplicationController', {
	extend: 'Ext.app.Controller',
	
	requires : ['App.mixin.ErrorHandler'],
	
	stores : [ 'Menu', 'Favorite' ],
	models : [ 'Menu', 'Favorite' ],
	views : [ 'TopBar', 'FavoriteBar', 'OptionBar', 'TitleBar' ],
	
	refs : [{
		selector : '#content',
		ref : 'content'
	}, {
		selector : '#title',
		ref : 'title'
	}, {
		selector : '#favtog',
		ref : 'favTog'
	}],
	
	init : function() {
		this.control({
			'viewport' : {
				afterrender : this.onViewportAfterRender
			},
			'#content' : {
				afterrender : this.onContentAfterRender,
				showcontent : this.onShowContent,
				remove : this.onContentRemove
			},
			'#navbar button' : {
				click : this.onShowButtonClick
			},
			'#linkto_std' : {
				click : this.onStdLinkClick
			},
			'#logout' : {
				click : this.onLogoutClick
			},
			'#show_menubar' : {
				click : this.onMenuBarClick
			},
			'#favtog' : {
				click : this.onFavTogClick
			}
		});
		
		HF.mixin('App.mixin.ErrorHandler');
		
		HF.custom.titlebar({
			xtype : 'button',
			tooltip : T('button.folding_sidebar'),
			cls : 'btnCollapseSidebar',
			handler : function() {
				var navbar = Ext.getCmp('navbar');
				if(navbar) {
					navbar[navbar.isHidden() ? 'show' : 'hide']();
				}
			}
		});

		HF.custom.titlebar({
			xtype : 'button',
			tooltip : T('button.close'),
			cls : 'btnClose',
			handler : function() {
				var content = Ext.getCmp('content');
				var active = content.getLayout().getActiveItem();
				
				if(active) {
					content.remove(active);
				}
			}
		});

		HF.custom.statusbar({
			xtype : 'label',
			id : 'clock',
			text : new Date().toString(T('format.time'))
		});
		
		var clock;
		
		setInterval(function() {
			if(!clock) {
				clock = Ext.getCmp('clock');
			}
			if(clock) {
				clock.setText(new Date().toString(T('format.time')));
			}
		}, 1000);
	},
	
	onMenuBarClick : function() {
		var store = Ext.getStore('Menu');
		if(store.count() <= 0) {
			store.load();
		}

		var box = Ext.getCmp('content').getBox(true);
		HF.popup('Base.view.menu.MenuBar', null, {
			height : box.height - 118,
			x : box.width - 308,
			y : 92
		});
	},
	
	onContentRemove : function(content, comp) {
		var view = this.getContent().getLayout().getActiveItem();
		if(view)
			view.show();

		HF.history.add(view);
		
		this.refreshTitleBar(content, view);
	},
	
	onFavTogClick : function() {
		var view = this.getContent().getLayout().getActiveItem();

		var menustore = Ext.getStore('Menu');
		var favstore = Ext.getStore('Favorite');

		var menu = menustore.findRecord('template', Ext.getClassName(view));
		var fav = favstore.findRecord('template', Ext.getClassName(view));
		
		if(fav) {
			favstore.remove(fav);
			// fav.commit();
		} else if(menu){
			// localstorage에 추가할 때는 모델의 id를 지정해주어서는 안된다.
			var data = Ext.clone(menu.data);
			delete data.id;
			fav = favstore.add(data);
			// fav[0].commit();
		}
		
		this.getFavTog().setText(favstore.findRecord('template', Ext.getClassName(view)) ? 'Remove' : 'Add');
			
		this.changeEffect(Ext.getCmp('favoritebar'));
	},
	
	onViewportAfterRender : function() {
		Ext.Array.each(HF.custom.statusbar(), function(component) {
			try {
				HF.status.tray(component);
			} catch (e) {
				HF.error(T('error.CUSTOM-STATUSBAR-FAILURE', {
					view : component
				}), e);
			}
		}, this);

		if(HF.setting.get('setting-folding_sidebar')) {
			Ext.getCmp('navbar').hide();
		}

		var menuStore = Ext.getStore('Menu');
		menuStore.load();
	},
	
	onContentAfterRender : function() {
		var favStore = Ext.getStore('Favorite');		

		favStore.on('datachanged', function(store) {
			var favbar = Ext.getCmp('favoritebar');
			favbar.removeAll();
			
			store.each(function(record) {
				favbar.add({
					view : record.get('template'),
					text : record.get('alias'),
					tooltip : record.get('description') || record.get('alias'),
					icon : 'theme/image/menu/' + record.get('name') + '.png'
				});
			});
		});

		favStore.load();

		HF.history.force();
	},
	
	refreshTitleBar : function(content, view) {
		content = content || this.getContent();
		view = view || content.getLayout().getActiveItem();
		
		this.getTitle().setText(view ? view.title : '');
		
		if(view) {
			var favstore = Ext.getStore('Favorite');
			var fav = favstore.findRecord('template', Ext.getClassName(view));
			this.getFavTog().setText(fav ? 'Remove' : 'Add');
		} else {
			this.getFavTog().setText('');
		}
	},
	
	onShowContent : function(content, view) {
		content.getLayout().setActiveItem(view);
		this.refreshTitleBar(content, view);
	},
	
	onShowButtonClick : function(button) {
		HF.show(button.view);
	},
	
	onStdLinkClick : function() {
		document.location.href = STD_URL;
	},
	
	onLogoutClick : function() {
		HF.msg.confirm({
			msg : T('text.Sure to logout'),
			fn : function(confirm) {
				if (confirm === 'yes') {
					document.location.href = typeof(LOGOUT_URL) === 'undefined' ? 'logout?targetUrl=/ops' : LOGOUT_URL;
				}
			}
		});
	},
	
	changeEffect : function(view) {
		var el = view.getEl();
		el.fadeOut({ opacity: 0.2, duration: 100}).fadeIn({ opacity: 1, duration: 200});
	}
});
Ext.define('App.controller.ApplicationController', {
	extend: 'Ext.app.Controller',
	
	requires : ['App.mixin.ErrorHandler'],
	
	stores : [ 'Menu', 'Favorite', 'SubMenu', 'Timezone', 'YesNo' ],
	models : [ 'Menu', 'Favorite' ],
	views : [ 'TopBar', 'RibonBar', 'NavBar', 'TitleBar', 'SideBar' ],
	
	refs : [{
		selector : '#content',
		ref : 'content'
	}, {
		selector : '#title',
		ref : 'title'
	}, {
		selector : '#ribonbar',
		ref : 'ribonBar'
	}, {
		selector : '#sidebar',
		ref : 'sideBar'
	}],
	
	init : function() {
		this.control({
			'viewport' : {
				afterrender : this.onViewportAfterRender
			},
			'#content' : {
				afterrender : this.onContentAfterRender,
				showcontent : this.onShowContent,
				add : this.onContentAdd,
				remove : this.onContentRemove
			},
			'#navbar dataview' : {
				itemclick : this.onMenuItemClick
			},
			'#ribonbar button' : {
				click : this.onTopLevelMenuClick
			},
			'#linkto_ops' : {
				click : this.onOpsLinkClick
			},
			'#logout' : {
				click : this.onLogoutClick
			}
		});
		
		HF.mixin('App.mixin.ErrorHandler');
		
		HF.custom.titlebar({
			xtype : 'button',
			tooltip : T('button.collapse_search'),
			cls : 'btnCollapseSearch',
			handler : function() {
				var content = Ext.getCmp('content');
				view = content.getLayout().getActiveItem();

				if(view) {
					var searchbar = view.down('base_entity_list_search');
					if(searchbar) {
						searchbar[searchbar.isHidden() ? 'show' : 'hide']();
					}
				}
			}
		});

		HF.custom.titlebar({
			xtype : 'button',
			tooltip : T('button.folding_sidebar'),
			cls : 'btnCollapseSidebar',
			handler : function() {
				var sidebar = Ext.getCmp('sidebar');
				sidebar[sidebar.isHidden() ? 'show' : 'hide']();
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
	
	onContentAdd : function(content, comp) {
		// sidebar에 supplement_view가 있으면, 추가한다.
		if(comp.supplementView) {
			this.getSideBar().add({
				xtype : comp.supplementView,
				itemId : comp.supplementView
			});
		}
	},
	
	onContentRemove : function(content, comp) {
		// sidebar에 supplement_view가 있으면, 제거한다.
		if(comp.supplementView) {
			this.getSideBar().remove(comp.supplementView);
		}

		var view = this.getContent().getLayout().getActiveItem();

		if(view) {
			view.show();
			this.onShowContent(content, view);
		} else {
			this.getSideBar().getLayout().setActiveItem('base');
			this.refreshTitleBar(content);
		}

		HF.history.add(view);
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
		
		var menuStore = Ext.getStore('Menu');
		menuStore.on('load', function(store) {
			var ribonBar = Ext.getCmp('ribonbar');
			ribonBar.removeAll();

			store.each(function(record) {
				// category가 TERMINAL이거나 hidden_flag가 true이면 메뉴에 보여주지 않는다. 
				if(record.get('menu_type') == 'MENU' && record.get('category') != 'TERMINAL' && !record.get('hidden_flag')) {
					ribonBar.add({
						menu_id : record.get('id'),
						text : T('menu.' + record.get('name'))
					});
				}
			});
			
			// 현재 액티브 화면의 톱레벨 메뉴와 서브메뉴를 디스플레이 한다.
			var view = HF.current.view();
			if(view) {
				var menu = store.findRecord('template', view.itemId);
				if(menu) {
					var parent_menu_id = menu.get('parent_id');
					var topmenu = Ext.getCmp('ribonbar').down('[menu_id=' + parent_menu_id + ']');
					if(topmenu) {
						this.showSubMenus(topmenu, true);
					}
				} else {
					var first = ribonBar.items.first();
					if(first) {
						this.showSubMenus(first, true);
					}
				}
			} else {
				var first = ribonBar.items.first();
				if(first) {
					this.showSubMenus(first, true);
				}
			}
		}, this);
		
		menuStore.load();
	},
	
	onContentAfterRender : function() {
		// Ext.getStore('Favorite').load();
		
		// 원할한 화면 레이아웃팅을 위해서 강제로 지연시킴.
		setTimeout(function() {
			HF.history.force();
		}, 1);
		
		// 기본으로 숨긴다. TODO 설정사항으로 ....
		this.getSideBar().hide();
	},
	
	showSubMenus : function(button, prohibitAutoStartFirstMenu) {
		Ext.Array.each(this.getRibonBar().query('button'), function(button) {
			if(!button.hasCls('active'))
				return;
			button.removeCls('active');
			return false;
		});
		
		button.addCls('active');
		
		var parent_id = button.menu_id;

		var menuStore = Ext.getStore('Menu');
		var subMenuStore = Ext.getStore('SubMenu');
		var subMenus = [];
		menuStore.each(function(record) {
			if(record.get('parent_id') == parent_id && !record.get('hidden_flag')) {
				subMenus.push(record.data);
			}
		});
		subMenuStore.loadData(subMenus);
		
		Ext.getCmp('submenu_title').setText(button.getText());
		
		// Top Menu 가 선택되면, 첫번째 서브메뉴를 자동으로 시작한다.
		if(!prohibitAutoStartFirstMenu) {
			Ext.Array.each(subMenus, function(menu) {
				if(menu.menu_type !== 'SEPARATOR') {
					HF.show(menu.template);
					return false;
				}
				return true
			});
		}
	},
	
	refreshTitleBar : function(content, view) {
		content = content || this.getContent();
		view = view || content.getLayout().getActiveItem();
		
		this.getTitle().setText(view ? view.title : '');
	},
	
	onShowContent : function(content, view) {
		content.getLayout().setActiveItem(view);
		this.refreshTitleBar(content, view);
		
		// sidebar에 supplement_view가 있으면, activate 시킨다.
		if(view.supplementView) {
			this.getSideBar().getLayout().setActiveItem(view.supplementView);
		} else {
			this.getSideBar().getLayout().setActiveItem('base');
		}
		
		// 현재 새로 추가된 화면과 관련된 TOP Level 메뉴와 서브메뉴를 표현한다.
		var menuStore = Ext.getStore('Menu');
		var menu = menuStore.findRecord('template', view.itemId);
		if(menu) {
			var parent_menu_id = menu.get('parent_id');
			var topmenu = Ext.getCmp('ribonbar').down('[menu_id=' + parent_menu_id + ']');
			if(topmenu) {
				this.showSubMenus(topmenu, true);
			}
		}
	},
	
	onTopLevelMenuClick : function(button) {
		this.showSubMenus(button);
	},
	
	onOpsLinkClick : function() {
		document.location.href = OPS_URL;
	},
	
	onLogoutClick : function() {
		HF.msg.confirm({
			msg : T('text.Sure to logout'), 
			fn : function(confirm) {
				if (confirm === 'yes') {
					document.location.href = typeof(LOGOUT_URL) === 'undefined' ? 'logout?targetUrl=/' : LOGOUT_URL;
				}
			}
		});
	},

	onMenuItemClick : function(view, record, item, index, e, opt) {
		if(record.get('menu_type') !== 'SEPARATOR')
			HF.show(record.get('template'));
	}
});
Ext.define('Base.view.menu.Menu', {
	
	extend: 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'Base.view.menu.MenuSearch',
		'Base.view.menu.MenuList',
		'Base.view.menu.SubMenuList'
	],
	
	xtype : 'base_menu',
	
	title : T('title.menu'),
	
	//searchView : 'base_menu_search',
	
	gridView : 'base_menu_list',
	
	subView : 'base_submenu_list'
	
});
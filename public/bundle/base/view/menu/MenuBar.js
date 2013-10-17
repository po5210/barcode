Ext.define('Base.view.menu.MenuBar', {
	extend : 'Base.abstract.Popup',

	xtype : 'base_menubar',

	title : T('title.menu'),

	modal : true,
	
	closeOnClickMask : true,

	closable : false,

	width : 320,

	height : 600,
	
	cls : 'menuModal',

	layout : 'fit',

	items : [ {
		xtype : 'dataview',
		autoScroll : true,
		store : 'Menu',
		
		itemSelector : 'div',
		tpl : [ '<tpl for=".">', 
		        '<tpl if="parent_id">', 
		        	'<div class="menuItem">',
		        		'<span style="background:url(theme/image/menu/{name}.png) 0 -3px no-repeat"></span>{[T("menu." + values.name)]}', 
		        	'</div>', 
		        '</tpl>',
				'<tpl if="!parent_id">', 
					'<div class="menuGroup">',
						'{[T("menu." + values.name)]}', 
					'</div>', 
				'</tpl>', 
			'</tpl>' ]
	} ]
});
Ext.define('App.view.NavBar', {
	extend : 'Ext.panel.Panel',
	
	xtype : 'navbar',
	
	id : 'navbar',
	
	cls : 'navbar',
	
	autoScroll : true,
	
	dockedItems : [{
		xtype : 'toolbar',
		items : {
			xtype : 'label',
			text : '',
			id : 'submenu_title',
			textAlign : 'left',
			height:40
		},
		dock : 'top'
	}],
	
	items : [{
		xtype : 'dataview',
		store : 'SubMenu',
		itemSelector : 'a',
		overItemCls : 'menu-item-hover',
		tpl : [
			'<tpl for=".">',
				'<tpl switch="menu_type">',
					'<tpl case="SEPARATOR">',
			            '<a class="menu-item-separator">{[T("menu." + values.name)]}</a>',
					'<tpl default>',
						'<tpl if="this.current(values)">',
				            '<a class="menu-item menu-item-active">{[T("menu." + values.name)]}</a>',
				        '<tpl else>',
				            '<a class="menu-item">{[T("menu." + values.name)]}</a>',
				        '</tpl>',
				'</tpl>',
			'</tpl>',
			{
				current : function(values) {
					var view = HF.current.view();
					return view ? view.itemId === values.template : false;
				}
			}
		]
	}]
});

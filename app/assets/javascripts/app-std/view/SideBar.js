Ext.define('App.view.SideBar', {
	extend : 'Ext.panel.Panel',
	
	xtype : 'sidebar',
	
	id : 'sidebar',
	
	layout : 'card',
	
	dockedItems : [{
		xtype : 'component',
		dock : 'top',
		height : 40,
		data : login,
		tpl : "<div class='brand'>{current_domain_id}<span>{email}</span></div>"	
	}],
	
	hidden : HF.setting.get('setting-folding_sidebar'),
	
	items : [ {
		xtype : 'container',
		itemId : 'base'
	} ]
});

Ext.define('Bar.view.bar_matout.BarMatoutSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'bar_bar_matout_search',
		
	items : [
		{ fieldLabel : T('label.who_dt'), name : 'who_dt-like' },
		{ fieldLabel : T('title.bar_locgrp'), name : 'bar_locgrp.name-eq', xtype : 'entitysearchcombo', storeClass : 'Bar.store.BarLocgrp', valueField : 'name' },
		{ fieldLabel : T('label.name'), name : 'name-like' },
	]
	
});
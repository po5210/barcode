Ext.define('Bar.view.bar_locgrp.BarLocgrp', {
	
	extend: 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'Bar.view.bar_locgrp.BarLocgrpSearch',
		'Bar.view.bar_locgrp.BarLocgrpList'
	],
	
	xtype : 'bar_bar_locgrp',
	
	title : T('menu.BarLocgrp'),
	
	searchView : 'bar_bar_locgrp_search',
	
	gridView : 'bar_bar_locgrp_list'
	
});
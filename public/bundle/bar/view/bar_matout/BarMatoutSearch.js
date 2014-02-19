Ext.define('Bar.view.bar_matout.BarMatoutSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'bar_bar_matout_search',
		
	items : [
		{ 
			name : 'who_dt' , 
			fieldLabel : T('label.who_dt'), 		   
		   xtype : 'datefield', 
		   format : T('format.date'), 
		   submitFormat : T('format.submitDate') 
		},
		{ 
			fieldLabel : T('title.bar_locmap'), 
			name : 'bar_locmap.name-eq', 
			xtype : 'entitysearchcombo', 
			storeClass : 'Bar.store.BarLocmap', 
			valueField : 'name', 
			associationField : [ 
				'bar_locgrp.name-eq',
				{
					name : 'prod_line_fg-in',
					value : function() {
						return "3,4";
					}
				}
			] 
		}
	]
	
});
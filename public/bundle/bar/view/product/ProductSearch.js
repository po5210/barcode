Ext.define('Bar.view.product.ProductSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'bar_product_search',
		
	items : [
		{ fieldLabel : T('label.code'), name : 'name-like' },
		{ fieldLabel : T('label.name'), name : 'description-like' },
		{ 
			fieldLabel : T('title.bar_locgrp'), 
			name : 'bar_locgrp.name-eq', 
			xtype : 'entitysearchcombo', 
			storeClass : 'Bar.store.BarLocgrp', 
			valueField : 'name' 
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
		},	
		{ 
			fieldLabel : T('label.routing'), 
			name : 'routing-eq', 
			xtype : 'entitysearchcombo', 
			storeClass : 'Bar.store.BarLocmap', 
			valueField : 'name', 
			associationField : [ 
				'bar_locgrp.name-eq',
				{
					name : 'prod_line_fg-notin',
					value : function() {
						return "3,4";
					}
				}
			] 
		},
		{ fieldLabel : T('label.routing'), name : 'routing-like' },		
		{ fieldLabel : T('label.use_yn'), name : 'use_yn-eq', xtype : 'codecombo', commonCode : 'USE_YN', displayField : 'description' },
	]
	
});
Ext.define('Bar.view.instock.Instock', {
	
	extend : 'Base.abstract.Panel',
	
	xtype : 'bar_instock',
	
 	requires : [ 
		'Bar.view.instock.InstockSearch',
		'Bar.view.instock.InstockList',
		'Bar.view.instock.InstockSublist'
	],
		
	title : T('menu.Instock'),
	
	layout : { type : 'vbox', align : 'stretch' },
	
	searchView : 'bar_instock_search',
	
	gridView : 'bar_instock_list',
	
	subView : 'bar_instock_sublist',
	
	initComponent : function() {

		this.callParent(arguments);
		
		this.add({
			xtype : 'panel',
			layout : { type : 'hbox', align : 'stretch' },
			items : [ {
				xtype : 'label',
				text : 'Instock Items',
				margin : '10 50 5 0'
			}, {
				xtype : 'textfield',
				name : 'scan_all',
				margin : '0 0 5 0',
				flex : 1
			} ]
		});
				
		this.add({
			xtype : this.gridView,
			flex : 1
		});
				
		this.add({
			xtype : 'splitter',
			collapsible : false
		});
		
		this.add({
			xtype : 'panel',
			layout : { type : 'hbox', align : 'stretch' },
			items : [ {
				xtype : 'label',
				text : 'Lot List',
				margin : '10 80 5 0'
			}, {
				xtype : 'textfield',
				name : 'scan_lot',
				margin : '0 0 5 0',
				flex : 1
			} ]
		});
					
		this.add({
			xtype : this.subView,
			flex : 1
		});
	}
});
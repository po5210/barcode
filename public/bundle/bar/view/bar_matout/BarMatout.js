Ext.define('Bar.view.bar_matout.BarMatout', {
	
	extend: 'Base.abstract.Panel',
	
 	requires : [ 
		'Bar.view.bar_matout.BarMatoutSearch',
		'Bar.view.bar_matout.BarMatoutList'
	],
	
	xtype : 'bar_bar_matout',
	
	title : T('menu.BarMatout'),
	
	layout : { type : 'vbox', align : 'stretch' },
	
	searchView : 'bar_bar_matout_search',
	
	gridView : 'bar_bar_matout_list',
	
	initComponent : function() {

		this.callParent(arguments);
		
		this.add({
			xtype : 'panel',
			layout : { type : 'hbox', align : 'stretch' },
			items : [ 
				{
					xtype : 'label',
					text : 'Barcodes',
					margin : '10 50 5 0'
				}, 
				{
					xtype : 'textfield',
					name : 'scan_master',
					itemId : 'scan_master',
					margin : '0 0 5 0',
					flex : 1,
					enableKeyEvents : true
				},
				{
					xtype : 'textfield',
					name : 'barcode_scan_info',
					itemId : 'barcode_scan_info',
					//hidden : true
				}
			 ]
		});
				
		this.add({
			xtype : this.gridView,
			flex : 1
		});
	}
	
});
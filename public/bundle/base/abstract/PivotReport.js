Ext.define('Base.abstract.PivotReport', {
	
	extend : 'Base.abstract.Panel',
	
	requires : ['Mz.pivot.Grid'],
	
	xtype : 'base_pivot_report',
	
	layout : 'card',
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->']
	} ]

});
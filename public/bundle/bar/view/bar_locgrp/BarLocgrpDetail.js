Ext.define('Bar.view.bar_locgrp.BarLocgrpDetail', {
	
	extend : 'Base.abstract.Popup',
	
 	requires : [ 
		'Bar.view.bar_locgrp.BarLocgrpForm'
	],
	
	xtype : 'bar_bar_locgrp_detail',
	
	title : T('menu.BarLocgrp'),
		
	items : [ {
		xtype : 'bar_bar_locgrp_form'
	} ],
	
	setRecord : function(record) {
		this.record = record;
		this.down('form').loadRecord(this.record);
	},
	
	getRecord : function() {
		return this.record;
	}
});
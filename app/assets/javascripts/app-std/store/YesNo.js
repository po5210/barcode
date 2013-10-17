Ext.define('App.store.YesNo', {
	
	extend : 'Ext.data.Store',

	fields : [ 'name', 'value' ],

	data : [
		{ name : "Y" , value : "Y" },
		{ name : "N" , value : "N" },
		{ name : "" , value : "" }
	]
});
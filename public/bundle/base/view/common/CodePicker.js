Ext.define('Base.view.common.CodePicker', {
	extend : 'Ext.panel.Panel',

	xtype : ['base_codepicker', 'codepicker'],
	
	header : false,
	
	floating : true,
	
	minHeight : 250,
	maxHeight : 270,
	minWidth : 300,
	maxWidth : 350,

	bodyPadding : 0,
	
	cls : 'codePicker',

	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	
	items : [{
		xtype : 'grid',
		flex : 1,
		columns : [{
			text : T('label.name'),
			dataIndex : 'name',
			flex : 1
		}, 	{
			text : T('label.description'),
			dataIndex : 'description',
			flex : 2
		}]
	}, {
		xtype : 'container',
		itemId : 'search',
		layout : {
			type : 'hbox',
			align : 'stretch'
		},
		items : [{
			xtype : 'textfield',
			name : 'name',
			hideLabel : true,
			emptyText : T('label.name'),
			flex : 1
		}, 	{
			xtype : 'textfield',
			name : 'description',
			hideLabel : true,
			emptyText : T('label.description'),
			flex : 2
		}]
	}]
});

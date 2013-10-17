Ext.define('Base.view.common.EntityPicker', {
	extend : 'Ext.panel.Panel',

	xtype : ['base_entitypicker', 'entitypicker'],
	
	header : false,
	
	floating : true,
	
	width : 500,
	height : 400,

	bodyPadding : 0,
	
	cls : 'codePicker',
	
	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	column_1_data_index : 'name',
	column_1_empty_text : T('label.code'),
	column_2_data_index : 'description',
	column_2_empty_text : T('label.description'),

	initComponent : function() {
		this.column_1_search_name = this.column_1_search_name || '_q[' + this.column_1_data_index + '-like]';
		this.column_2_search_name = this.column_2_search_name || '_q[' + this.column_2_data_index + '-like]';
		
		this.items = [{
			xtype : 'form',
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			cls : 'header',
			items : [{
				xtype : 'textfield',
				flex : 1,
				name : this.column_1_search_name,
				emptyText : this.column_1_empty_text
			}, {
				xtype : 'textfield',
				flex : 2,
				name : this.column_2_search_name,
				emptyText : this.column_2_empty_text
			}]
		}, {
			xtype : 'grid',
			flex : 1,
			hideHeaders : true,
			columns : [{
				dataIndex : this.column_1_data_index,
				flex : 1
			}, 	{
				dataIndex : this.column_2_data_index,
				flex : 2
			}],
			bbar: {
				xtype : 'pagingtoolbar',
				cls : 'pagingToolbar',
	            displayInfo: true,
	            displayMsg: T('text.Paging Toolbar Display Message'),
	            emptyMsg: T('text.Paging Toolbar Empty Message'),
				hidden : true
	        }
		} ];
		
		this.callParent();
	}
});

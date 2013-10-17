Ext.define('Base.view.entity.EntityColumnList', {
	
	extend : 'Ext.grid.Panel',
	
	requires : ['Ext.ux.CheckColumn'],
	
	xtype : 'base_entity_column_list',
	
	title : T('title.entity_column'),
	
	store : Ext.create('Ext.data.Store', {
		fields : [ {
			name : 'id', type : 'string'
		}, {
			name : 'entity_id', type : 'string'
		}, {
			name : '_cud_flag_', type : 'string'
		}, {
			name : 'name', type : 'string'
		}, {
			name : 'description', type : 'string'
		}, {
			name : 'pk', type : 'boolean'
		}, {
			name : 'column_type', type : 'string'
		}, {
			name : 'ref_type', type : 'string'
		}, {
			name : 'ref_name', type : 'string'
		}, {
			name : 'editable', type : 'boolean'
		}, {
			name : 'list_rank', type : 'integer'
		}, {
			name : 'search_rank', type : 'integer'
		}, {
			name : 'sort_rank', type : 'integer'
		}, {
			name : 'reverse_sort', type : 'boolean'
		}, {
			name : 'display_rank', type : 'integer'
		} ],
		data : []
	}),
	
	selType : 'cellmodel', 
	
	selModel : Ext.create('Ext.selection.CheckboxModel'),
	
    plugins : [ Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit : 1,
        autoCancel : true
    }) ],
	
	columns : [ {
		xtype: 'rownumberer'
	}, {
		header : T('label.id'),
		dataIndex : 'id',
		hidden : true
	}, { 
		dataIndex : 'entity_id',
		hidden : true
	}, { 
		dataIndex : '_cud_flag_',
		hidden : true,
		value : ''
	}, { 
		dataIndex : 'name',
		header : T('label.name'),
		flex : 1,
		editor : {
			xtype : 'textfield',
			allowBlank : false
		}
	}, { 
		dataIndex : 'description',
		header : T('label.description'),
		flex : 1.3,
		editor : {
			xtype : 'textfield'
		}
	}, { 
		header : T('label.ref_type'), 
		dataIndex : 'ref_type', 
		width : 90, 
		align : 'center', 
		xtype : 'codecolumn', 
		commonCode : 'ENTITY_REF_TYPE', 
		editor : { 
			xtype : 'codecombo', 
			commonCode : 'ENTITY_REF_TYPE' 
		}
	}, { 
		dataIndex : 'ref_name',
		width : 80,
		header : T('label.ref_name'),
		editor : {
			xtype: 'textfield'
		}
	}, { 
		dataIndex : 'column_type',
		header : T('label.column_type'),
		width : 90,
		editor : {
			allowBlank: false,
			xtype : 'codefield', 
			commonCode : 'ENTITY_FIELD_TYPE'
		}
	}, { 
		dataIndex : 'pk',
		header : T('label.pk'),
		width : 50,
		xtype: 'checkcolumn'
	}, /*{ 
		dataIndex : 'editable',
		header : T('label.editable'),
		width : 60,
		xtype: 'checkcolumn'
	},*/ { 
		dataIndex : 'list_rank',
		header : T('label.list_rank'),
		width : 80,
		editor : {
			xtype: 'numberfield'
		}
	}, { 
		dataIndex : 'search_rank',
		header : T('label.search_rank'),
		width : 85,
		editor : {
			xtype: 'numberfield'
		}
	}, { 
		dataIndex : 'sort_rank',
		header : T('label.sort_rank'),
		width : 70,
		editor : {
			xtype: 'numberfield'
		}
	}, { 
		dataIndex : 'reverse_sort',
		header : T('label.reverse_sort'),
		width : 90,
		xtype: 'checkcolumn'
	}, { 
		dataIndex : 'display_rank',
		header : T('label.display_rank'),
		width : 90,
		editor : {
			xtype: 'numberfield'
		}
	} ],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'back', 'locale', 'create', 'add', 'save', 'delete']
	} ]
});
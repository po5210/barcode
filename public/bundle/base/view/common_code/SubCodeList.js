Ext.define('Base.view.common_code.SubCodeList', {
	
	extend : 'Ext.grid.Panel',
	
	xtype : 'base_sub_code_list',
	
	// TODO CommonCode의 Rest 기능을 이용하도록 변경
	store : 'Base.store.SubCode',
	
    plugins : [ Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit : 1,
        autoCancel : true
    }) ],
	
	columns : [ { 
		header : T('label.id'),
		dataIndex : 'id',
		hidden : true
	}, { 
		dataIndex : 'parent_id', 
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
		flex : 2,
		editor : {
			xtype: 'textfield'
		}
	}, {
		header : T('label.creator'),
		dataIndex : 'creator',
		xtype : 'entitycolumn'
	}, { 
		dataIndex : 'created_at', 
		header : T('label.created_at'), 
		xtype : 'datecolumn', 
		format : T('format.datetime'), 
		width : 120
	}, { 
		header : T('label.updater'),
		dataIndex : 'updater',
		xtype : 'entitycolumn'
	}, { 
		dataIndex : 'updated_at', 
		header : T('label.updated_at'), 
		xtype : 'datecolumn', 
		format : T('format.datetime'), 
		width : 120 
	} ],
	
	selModel : Ext.create('Ext.selection.CheckboxModel'),
	
	tbar : { xtype : 'label', readOnly : true },
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'add', 'save', 'delete']
	} ]

});
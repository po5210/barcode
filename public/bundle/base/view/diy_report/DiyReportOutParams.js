Ext.define('Base.view.diy_report.DiyReportOutParams', {
	
	extend : 'Ext.grid.Panel',
	
	xtype : 'base_diy_report_out_params',
	
	title : T('title.out_parameters'),
	
	store : Ext.create('Ext.data.Store', {
		fields : [
			//{ name : 'id', type : 'string' },
			//{ name : 'resource_type', type : 'string'},
			//{ name : 'resource_id', type : 'string'},
			//{ name : '_cud_flag_', type : 'string' },
			{ name : 'name', type : 'string' },
			{ name : 'table_name', type : 'string' },
			{ name : 'description', type : 'string' },
			{ name : 'rank', type : 'integer' }
		],
		data : []
	}),
	
    plugins : [ Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit : 1,
        autoCancel : true
    }) ],

	selModel : Ext.create('Ext.selection.CheckboxModel'),
	
	columns : [ {
		header : T('label.id'),
		dataIndex : 'id',
		hidden : true
	}, { 
		dataIndex : 'resource_type',
		hidden : true
	}, { 
		dataIndex : 'resource_id',
		hidden : true
	}, { 
		dataIndex : 'name',
		header : T('label.name'),
		width : 150,
		editor : {
			xtype : 'textfield',
			allowBlank : false
		}
	}, { 
		dataIndex : 'description',
		header : T('label.description'),
		width : 150,
		editor : {
			xtype : 'textfield'
		}
	}, { 
		dataIndex : 'rank',
		header : T('label.rank'),
		width : 50,
		editor : {
			xtype: 'numberfield'
		}
	}, { 
		dataIndex : '_cud_flag_',
		hidden : true,
		value : ''
	} ],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'back', 'add', 'save', 'delete']
	} ],
	
	setRecord : function(record) {
		this.store.loadRawData(record.get('service_out_params'));
	}
});
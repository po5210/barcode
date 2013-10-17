Ext.define('Base.view.diy_service.DiyServiceOutParamsForm', {
	
	extend : 'Ext.grid.Panel',
	
	xtype : 'base_diy_service_out_params_list',
	
	title : T('title.out_parameters'),
	
	initComponent : function() {
		/**
		 *	피상속 클래스의 플러그인 객체와 셀모델 객체는 공유되어서는 안된다.
		 */
		this.plugins = [ Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1,
	        autoCancel : true
		}) ];
		
		this.selModel = Ext.create('Ext.selection.CheckboxModel', { pruneRemoved : false });
		
		this.store = Ext.create('Ext.data.Store', {
			fields : [
				{ name : 'id', type : 'string' },
				{ name : 'resource_type', type : 'string'},
				{ name : 'resource_id', type : 'string'},
				{ name : 'name', type : 'string' },
				{ name : 'description', type : 'string' },
				{ name : 'rank', type : 'integer' },
				{ name : '_cud_flag_', type : 'string' }
			],
			data : []
		});

		this.callParent();
	},
	
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
		editor : {
			xtype : 'textfield',
			allowBlank : false
		}
	}, { 
		dataIndex : 'description',
		header : T('label.description'),
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
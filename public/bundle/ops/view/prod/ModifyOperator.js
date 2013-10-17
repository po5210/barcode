/**
 * Modify Operators
 */
Ext.define('Ops.view.prod.ModifyOperator', {
	
	extend : 'Base.abstract.Popup',
	
	requires : ['Ext.ux.CheckColumn'],

	xtype : 'ops_modify_operator',
	
	title : T('title.modify_operator'),
	
	dockedItems : [ {
		xtype : 'controlbar',
		items : ['->', 'moveup', '->', 'movedown', '->', 'add', 'save', 'close']
	} ],
	
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	
	width : 1000,
	
	height : 650,
	
	y : 1,

	items : [ {
		xtype : 'form',
		layout : 'column',
		cls : 'infoFields2Column marginB20',
		defaultType : 'displayfield',
		items : [ {
			fieldLabel : T('label.date'),
			name : 'date',
			itemId : 'date'
		}, {
			fieldLabel : T('label.shift'),
			name : 'shift',
			itemId : 'shift'
		}, {
			fieldLabel : T('label.operation'),
			name : 'operation',
			itemId : 'operation'
		}, {
			fieldLabel : T('label.machine'),
			name : 'machine',
			itemId : 'machine'
		} ]
	}, {
		xtype : 'grid',
		flex : 1,
		
		store : Ext.create('Ext.data.Store', {
			fields : [ {
				name : 'user', type : 'auto'
			}, {
				name : 'start_time', type : 'date', format : T('format.time_without_sec')
			}, {
				name : 'end_time', type : 'date', format : T('format.time_without_sec')
			}, {
				name : 'id', type : 'string'
			} ],
			proxy : {
				type : 'ajax',
				// url : '/domains/' + login.current_domain_id + '/diy_services/OpsGetJobOperators/query.json',
				url : '/domains/' + login.current_domain_id + '/ops/job_operators.json',
				format : 'json',
				reader : {
					type : 'json'
				}
			},
			worker_add_row : function(date) {
				this.insert(0, {"user" : "", "start_time" : date, "end_time" : "", "id" : ""});
			}
		}),
		
		autoScroll : true,

		columns : [ {
			hidden : true,
			dataIndex : 'id',
			text : ''
		}, {
			text : T('label.name'),
			dataIndex : 'user',
			flex : 2,
			xtype : 'entitycolumn',
			editor : {
				xtype : 'entityfield',
				pickerConfig : {
					column_1_data_index : 'id',
					column_1_empty_text : T('label.login'),
					column_2_data_index : 'name',
					column_2_empty_text : T('label.name')
				},
				storeClass: 'Base.store.User'
			}
		}, {
			text : T('label.id'),
			dataIndex : 'user',
			flex : 1,
			renderer : function(val) { 
				return val.id; 
			}
		}, {
			xtype: 'datecolumn',
			text : T('label.start_time'),
			dataIndex : 'start_time',
			format : T('format.time_without_sec'),
			align : 'center',
			editor : {
				xtype : 'timefield',
				name: 'start_time',
				format : 'H:i',
				submitFormat: 'H:i',
				increment: 10,
				anchor: '100%'
			},
			flex : 1
			
		}, {
			xtype : 'datecolumn',
			text : T('label.end_time'),
			dataIndex : 'end_time',
			itemId : 'end_time',
			format : T('format.time_without_sec'),
			align : 'center',
			editor : {
				xtype : 'timefield',
				name: 'end_time',
				format : 'H:i',
				submitFormat : 'H:i',
				increment : 10,
				anchor : '100%'
			},
			flex : 1
		}, {
			xtype : 'actioncolumn',
			icon : 'theme/imageOPS/btnDelete.png',
			width : 90,
			align : 'center',
			handler : function(grid, rowIndex, colIndex, item, e, record) {
				grid.getStore().removeAt(rowIndex, 1);
			}
		} ],
		
		selType: 'cellmodel',
		
		plugins : [
			Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
	        	autoCancel : true
		})]
	}]	
});
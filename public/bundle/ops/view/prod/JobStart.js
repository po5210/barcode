/**
 * Job Start
 */
Ext.define('Ops.view.prod.JobStart', {
	
	extend : 'Base.abstract.Popup',
	
	xtype : 'ops_prod_start',
	
	title : T('title.job_start'),
	
	dockedItems : [ {
		xtype : 'controlbar',
		items : ['->', 'moveup', '->', 'movedown', '->', 'check_all', 'add', 'save', 'close']
	} ],
	
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	
	width : 750,
	
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
				name : 'type', type : 'string'
			}, {
				name : 'status', type : 'string'
			} ],
			proxy : {
				type : 'ajax',
				url : '/domains/' + login.current_domain_id + '/diy_services/OpsGetStartOperators/query.json',
				format : 'json',
				reader : {
					type : 'json'
				}
			},
			worker_add_row : function() {
				this.insert(0, {'user' : { id : '', name : '' }, 'type' : 'new', 'status' : 'Y'});
			}
		}),
		
		autoScroll : true,

		columns : [ {
			header : T('label.check'),
			xtype : 'actioncolumn',
			itemId : 'status',
			width : 100,
			align : 'center',
			renderer : function(value, metaData, record, row, col, store, gridView) {
				if(record.get("status") == '') {
					return "<img src=\"theme/imageOPS/wait.png\"/>";
				} else if(record.get("status") == 'Y') {
					return "<img src=\"theme/imageOPS/start.png\"/>";
				} 
			}
		}, {
			text : T('label.name'),
			dataIndex : 'user',
			flex : 1,
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
		} ],
		
		selType : 'cellmodel',
		
		plugins : [
			Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1,
	        	autoCancel : true
		}) ]
	} ]	
});
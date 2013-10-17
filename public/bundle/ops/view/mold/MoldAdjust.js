/**
 * Mold Adjust
 */
Ext.define('Ops.view.mold.MoldAdjust', {
	
	extend : 'Base.abstract.Popup',
	
	requires : ['Ext.ux.CheckColumn', 'Base.view.common.DatetimeCombo', 'Ops.store.HourStore', 'Ops.store.MinStore'],

	xtype : 'ops_mold_adjust',
	
	width : 930,
	
	height : 700,
	
	title : T('title.mold_breakdown_adjust'),
	
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'add', 'save', 'close']
	} ],
	
	items: [ {
		layout : 'column',
		defaultType : 'displayfield',
		xtype : 'panel',
		cls : 'infoFields2Column marginB10',
		title : T('title.mold_breakdown_report'),
		items : [ {
			fieldLabel : T('label.operation'),
			itemId : 'operation',
			flex : 1
		}, {
			fieldLabel : T('label.mold'),
			itemId : 'mold',
			flex : 1
		}, {
			xtype: 'displayfield',
			fieldLabel: T('label.reporter'),
			itemId : 'reporter',
			flex : 1
		}, {
			xtype : 'displayfield',
			fieldLabel : T('label.event_time'),
			itemId : 'event_time',
			flex : 1
		}, {
			xtype : 'displayfield',
			fieldLabel : T('label.description'),
			itemId : 'reporter_comment',
			flex : 1
		}, {
			xtype : 'displayfield',
			fieldLabel : '',
			flex : 1
		} ]
	}, {
		xtype : 'form',
		items : [ {
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			xtype : 'panel',
			title : T('title.mold_breakdown_adjust'),
			items : [ {
				xtype : 'datetimecombo',
				cls : 'marginB10',
				name : 'maint_start_time',
				itemId : 'maint_start_time',
				fieldLabel : T('label.maint_start_time'),
				initValue : new Date()
			},	{
				xtype : 'datetimecombo',
				cls : 'marginB10',
				name : 'maint_end_time',
				itemId : 'maint_end_time',
				fieldLabel : T('label.maint_end_time'),
				initValue : new Date()
			} ]
		}, {
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			xtype : 'panel',
			flex : 1,
			items : [ {
				name : 'id',
				itemId : 'mold_loss_id',
				hidden : true
			}, {
				fieldLabel : T('label.maintainer'),
				flex : 1,
				name : 'maintainer',
				xtype : 'entityfield',
				pickerConfig : {
					column_1_data_index : 'login',
					column_1_empty_text : T('label.login'),
					column_2_data_index : 'name',
					column_2_empty_text : T('label.name')
				},
				storeClass : 'Base.store.User',
				allowBlank : false
			}, {
				xtype: 'numberfield',
				name : 'maintainer_count',
				fieldLabel: T('label.worker_count'),
				flex : 1,
				allowBlank : false,
				minValue : 0,
				value : 1
			} ]
		}, {
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			xtype : 'panel',
			cls : 'marginT10',
			items : [ {
				fieldLabel : T('label.breakdown_code'),
				name : 'mold_loss_code',
				itemId : 'mold_loss_code',
				xtype : 'codecombo',
				commonCode : 'MOLD_LOSS_CODE',
				displayField : 'description',
				flex : 1,
				allowBlank : false
			}, {
				xtype : 'textareafield',
				fieldLabel : T('label.description'),
				name : 'maint_comment',
				rows : 3,
				flex : 1,
				maxLength : 1300
			} ]
		} ]
	}, {
		xtype : 'grid',
		scroll : true,
		title: T('menu.SparePart'),
		flex: 0.35,
		store: Ext.create('Ext.data.Store', {
			fields: [ {
				name: 'id', type : 'string'
			}, {
				name: 'spare_part', type : 'auto'
			}, {
				name: 'used_qty', type : 'integer'
			}, {
				name: '_cud_flag', type : 'string'
			} ],
			proxy: {
				type: 'memory',
				reader: {
					type: 'json'
				}
			},
			add_row : function() {
				this.insert(0, {"id" : "", "spare_part" : { id : "", name : "", desc : "", current_stock : 0 }, "used_qty" : 0, "_cud_flag" : ""});
			}
		}),

		autoScroll : true,

		columns : [ {
			dataIndex : 'id',
			hidden : true
		},	{
			dataIndex : '_cud_flag',
			hidden : true
		}, {
			text : T('menu.SparePart'),
			dataIndex : 'spare_part',
			flex : 1,
			xtype : 'entitycolumn',
			itemId : 'spare_part',
			editor : {
				xtype : 'entityfield',
				itemId : 'spare_part_editor',
				storeClass : 'Mld.store.SparePart',
				listeners : {
			        'select' : {
			            fn : function(me, record) {
							me.value.desc = record.data.description;
							me.value.current_stock = record.data.current_stock;
							
							var gridRecord = me.up(' grid').getSelectionModel().getSelection()[0];
							var sparePart = gridRecord.data.spare_part;
							sparePart.desc = record.data.description;
							sparePart.current_stock = record.data.current_stock;
							gridRecord.set('spare_part', sparePart);
							gridRecord.commit();
			            },
			            scope : this
			        }
			    }
			}
		}, {
			text : T('label.description'),
			dataIndex : 'spare_part',
			flex : 1.5,
			renderer : function(val) {
				return val ? val.desc : '';
			}
		/*}, {
			text : T('label.current_stock'),
			dataIndex : 'spare_part',
			xtype : 'numbercolumn',
			format : T('format.number'),
			itemId : 'current_stock',
			flex : 0.65,
			align : 'right',
			renderer : function(val) {
				return val ? val.current_stock : 0;
			}*/
		}, {
			text : T('label.usage'),
			dataIndex : 'used_qty',
			xtype : 'numbercolumn',
			format : T('format.number'),
			itemId : 'used_qty',
			align : 'right',
			editor : { xtype : 'numberfield' },
			width : 90
		}, {
			xtype : 'actioncolumn',
			text : T('button.delete'),
			align : 'center',
			icon: 'theme/imageOPS/btnDelete.png',
			width : 60,
			handler: function(grid, rowIndex, colIndex, item, e, record) {
				record.set('_cud_flag', 'd');
				grid.getStore().removeAt(rowIndex, 1);
			}
		} ],
		
		selType: 'cellmodel',
		
		plugins: [
			Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 1,
		        autoCancel : true
			})
		]
	} ]
});
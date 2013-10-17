/**
 * Add Scrap
 */
Ext.define('Ops.view.prod.AddScrap', {
	
	extend : 'Base.abstract.Popup',
	
	requires : ['Ext.ux.CheckColumn'],

	xtype : 'ops_prod_add_scrap',
	
	title : T('label.defect'),
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'add', 'save', 'close']
	} ],
	
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	
	height : 550,
	
	y : 5,
	
	initComponent : function() {
		this.items = [ 
			this.createGridPart(this),
			this.createReworkPart(this),
			this.createInfoPart(this)
		];
		
		this.callParent();
	},
	
	createInfoPart: function(view) {
		return {
			xtype : 'panel', 
			layout : 'column',
			cls : 'infoFields2Column',
			defaultType : 'displayfield',
			items: [ {
				fieldLabel : T('label.date'),
				name : 'date',
				itemId : 'date',
				value : HF.setting.get('option-work_date_disp')
			}, {
				fieldLabel : T('label.shift'),
				name : 'shift',
				itemId : 'shift',
				value : HF.setting.get('option-shift_name')
			}, {
				fieldLabel : T('label.operation'),
				name : 'operation',
				itemId : 'operation'
			}, {
				fieldLabel : T('label.machine'),
				name : 'machine',
				itemId : 'machine'
			}, {
				fieldLabel : T('label.product'),
				name : 'product',
				itemId : 'product'
			}, {
				fieldLabel : T('label.actual'),
				name : 'actual',
				itemId : 'actual'
			}, {
				fieldLabel : T('label.rework'),
				name : 'rework',
				itemId : 'rework'
			}, {
				fieldLabel : T('label.defect'),
				name : 'defect',
				itemId : 'defect'
			} ]
		}
	},
	
	createReworkPart : function(view) {
		return {
			xtype : 'panel',
			cls : 'marginB20',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [ {
				xtype : 'container',
				layout : {
					type : 'hbox',
					align : 'stretch'
				},
				items : [ {
					fieldLabel : T('label.rework_qty'),
					xtype : 'numberfield',
					name : 'rework_qty',
					width : 220,
					itemId : 'rework_qty',
					value : 0,
					minValue : 0,
					flex : 1
				}, {
					xtype : 'button', 
					width : 80, 
					text : T('button.keypad'),
					margin : '0 5 0 5',
					align : 'center', 
					itemId : 'rework_keypad'
				} ]
			} ]
		};
	},
	
	createGridPart: function(view) {
		return {
			xtype : 'grid',
			flex : 1,
			scroll : true,
			//cls : 'marginT10',
			title: T('label.scrap_qty'),
			flex: 0.5,
			store: Ext.create('Ext.data.Store', {
				fields: [ {
					name: 'defect_code'
				}, {
					name: 'defect_qty'
				} ],
				proxy: {
					type: 'memory',
					reader: {
						type: 'json'
					}
				},
				add_row : function() {
					this.insert(0, {"defect_code" : "", "defect_qty" : ""});
				}
			}),
	
			autoScroll : true,
	
			columns : [ {
				text: T('label.defect_code'),
				dataIndex : 'defect_code',
				flex : 1,
				xtype: 'entitycolumn',
				editor: {
					xtype: 'entityfield',
					customSelectionUrl : '/domains/' + login.current_domain_id + '/defect_codes/list_by_operation.json?operation_id=' + HF.setting.get('option-operation').id,
					pageSize : 9
				}
			}, {
				text : T('label.defect_qty'),
				dataIndex : 'defect_qty',
				xtype : 'numbercolumn',
				format : T('format.number'),
				editor : {
					xtype : 'numberfield',
					minValue : 0,
					value : 0
				},
				flex : 1
			}, {
				xtype : 'actioncolumn',
				text : T('button.keypad'),
				itemId : 'grid_keypad',
				align : 'center',
				icon: 'theme/imageOPS/btnKeypad.png',
				flex : 0.3
			}, {
				xtype : 'actioncolumn',
				text : T('button.delete'),
				align : 'center',
				icon: 'theme/imageOPS/btnDelete.png',
				flex : 0.3,
				handler: function(grid, rowIndex, colIndex, item, e, record) {
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
		}
	}
});
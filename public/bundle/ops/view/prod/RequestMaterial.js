/**
 * Request Material
 */
Ext.define('Ops.view.prod.RequestMaterial', {
	
	extend : 'Base.abstract.Popup',

	xtype : 'ops_prod_req_mat',
	
	title : T('title.req_mat'),
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'save', 'close']
	} ],
	
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	
	height : 420,
	
	initComponent : function() {
		this.items = [ 
			this.createInfoPart(this),
			this.createFormPart(this) 
		];
		
		this.callParent();
		var form = this.down('form');
		var productField = form.down('entityfield[name=product]');
		
		// Product 필드가 변경되었을 경우 수량 데이터를 가져와서 Lot Size 필드에 설정한다.
		productField.on('select', function(me, record) {
			var lotSizeField = form.down('textfield[name=lot_size]');
			if(lotSizeField) {
				lotSizeField.setValue(record.data.default_qty);
			}
		});
	},
	
	createInfoPart: function(view) {
		return {
			xtype : 'panel',
			layout : 'column',
			cls : 'infoFields2Column marginB20',
			defaultType : 'displayfield',
			items : [{
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
				itemId : 'operation',
				value : HF.setting.get('option-operation').name
			}, {
				fieldLabel : T('label.operation_desc'),
				name : 'operation_desc',
				itemId : 'operation_desc',
				value : HF.setting.get('option-operation_info').description
			}]
		}
	},
	
	createFormPart: function(view) {
		return {
			xtype : 'form',
			flex : 1,
			// cls : 'marginT10',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [{
				fieldLabel : T('label.lot_qty'),
				name : 'lot_size',
				xtype : 'textfield',
				itemId : 'lot_size',
				readOnly : true
			}, {
				fieldLabel : T('label.product'),
				name : 'product',
				xtype : 'entityfield',
				itemId : 'product',
				storeClass : 'Prod.store.Product',
				associationField : [ {
					name : 'prod_type-eq',
					value : function() {
						return 'RM';
					}
				} ],
				allowBlank : false
			}, {
				xtype : 'numberfield',
				name : 'request_qty',
				itemId : 'request_qty',
				fieldLabel : T('label.req_qty'),
				minValue : 1,
				allowBlank : false
			}, {
				fieldLabel : T('label.requester'),
				name : 'requestor',
				xtype : 'entityfield',
				pickerConfig : {
					column_1_data_index : 'login',
					column_1_empty_text : T('label.login'),
					column_2_data_index : 'name',
					column_2_empty_text : T('label.name')
				},
				storeClass : 'Base.store.User',
				allowBlank : false
			}]
		}
	}
});
/**
 * Add Plan
 */
Ext.define('Ops.view.prod.AddPlan', {
	
	extend : 'Base.abstract.Popup',

	xtype : 'ops_prod_add_plan',
	
	title : T('title.add_plan'),
	
	dockedItems : [ {
		xtype: 'controlbar',
		items: ['->', 'save', 'close']
	} ],
	
	layout : {
		type: 'vbox',
		align: 'stretch'
	},
	
	height : 320,
		
	y : 20,
	
	initComponent : function() {
		this.items = [ 
			this.createInfoPart(this),
			this.createFormPart(this)
		];
		
		this.callParent();
		
		var self = this;
		var form = this.down('form');
		var machineField = form.down('entityfield[name=machine]');
		
		// Machine 필드가 변경되었을 경우 Product Url을 변경한다. 
		machineField.on('select', function(me, record) {
			var productField = form.down('entityfield[name=product]');
			if(productField) {
				// 1. &machine_id 인덱스를 찾는다.
				// 2. 없으면 url 뒤에 붙이고 
				// 3. 있으면 &machine_id= 뒤 부분을 삭제하고 붙인다.
				if(productField.customSelectionUrl.indexOf("&machine_id") < 0) {
					productField.customSelectionUrl += '&machine_id=' + record.data.id;
				} else {
					var idx = productField.customSelectionUrl.lastIndexOf("=");
					var url = productField.customSelectionUrl.substring(0, idx);
					productField.customSelectionUrl = url + "=" + record.data.id;
				}
				
				if(productField.disabled) {
					productField.enable(true);
				}
			}
		});
	},
	
	createInfoPart : function(view) {
		return {
			xtype : 'panel',
			layout : 'column',
			cls : 'infoFields2Column marginB10',
			defaultType : 'displayfield',
			items : [ {
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
				value : HF.setting.get('option-operation_info').description
			} ]
		}
	},
	
	createFormPart : function(view) {
		return {
			xtype : 'form',
			flex : 1,
			cls : 'marginB10',
			layout : {
				type : 'hbox',
				align : 'stretch',
				
			},
			items : [ {
				fieldLabel : T('label.machine'),
				labelWidth : 70,
				allowBlank : false,
				flex : 1,
				name : 'machine',
				xtype : 'entityfield',
				itemId : 'machine',
				storeClass : 'Prod.store.Machine',
				associationField : [ {
					name : 'operation_id-eq',
					value : function() {
						return HF.setting.get('option-operation').id;
					}
				} ]
			}, {
				fieldLabel : T('label.product'),
				name : 'product',
				labelWidth : 70,
				flex : 1,
				xtype : 'entityfield',
				itemId : 'product',
				//customSelectionUrl : '/domains/' + login.current_domain_id + '/diy_services/OpsGetProducts/query.json?operation_id=' + HF.setting.get('option-operation').id,
				customSelectionUrl : '/domains/' + login.current_domain_id + '/prod_params/products_by_params.json?operation_id=' + HF.setting.get('option-operation').id,
				allowBlank : false,
				disabled : true
			} ]
		}
	}
});
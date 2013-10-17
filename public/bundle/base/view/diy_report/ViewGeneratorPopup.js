Ext.define('Base.view.diy_report.ViewGeneratorPopup', {
	
	extend : 'Base.abstract.Popup',

	xtype : 'base_report_view_generator_popup',
	
	title : T('title.view_generation'),
	
	items : [ {
		xtype : 'form',
		defaults : { xtype : 'textfield', anchor : '100%' },
		items : [ {
			fieldLabel : T('label.name'),
			itemId : 'name',
			name : 'resource_name',
			readOnly : true
		}, {
			fieldLabel : T('label.view_type'),
			name : 'view_type',
			value : 'report',
			readOnly : true
		}, {
			itemId : 'bundle',
			name : 'bundle',
			fieldLabel : T('label.bundle'),
			xtype : 'combo',
			store : Ext.create('Ext.data.Store', {
			    fields: ['name'],
			    data : [
					{'name' : 'base'},
					{'name' : 'prod'},
					{'name' : 'hcc'},
					{'name' : 'comp'}
			    ]
			}),
			queryMode: 'local',
			displayField: 'name',
			valueField: 'name'
		}, 	{
			fieldLabel : T('menu.diy_selection'),
			itemId : 'diy_selection_id',
			name : 'diy_selection_id',
			hidden : true
		}, {
			name : 'runtime_option',
			fieldLabel : T('label.runtime_option'),
			xtype : 'combo',
			store : Ext.create('Ext.data.Store', {
			    fields: ['name', 'value'],
			    data : [
					{'name' : 'Overwrite files that already exist', 'value' : '--force'},
					{'name' : 'Skip files that already exist', 'value' : '--skip'}
			    ]
			}),
			queryMode: 'local',
			displayField: 'name',
			valueField: 'value',
			value : '--force'
		} ]
	} ],
	
	initComponent : function() {
		this.callParent(arguments);
		var self = this;
		this.on('afterrender', function() {
			var menus = [];
			Ext.getStore('Menu').each(function(menu) {
				if(menu.get('menu_type') == 'MENU') {
					menus.push({name : menu.data.name});
				}
			});
			var form = this.child('form');
			form.add({
				name : 'parent_menu',
				fieldLabel : T('title.menu'),
				xtype : 'combo',
				store : Ext.create('Ext.data.Store', {
				    fields: ['name'],
				    data : menus
				}),
				queryMode: 'local',
				displayField: 'name',
				valueField: 'name'
			});
		});
	},
	
	getRecord : function() {
		return this.record;
	},
	
	setRecord : function(record) {
		this.record = record;
		var nameField = this.child('form #name');
		nameField.setValue(record.get('name'));
		var serviceField = this.child('form #diy_selection_id');
		serviceField.setValue(record.get('diy_selection_id'));
	},
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'generate', 'close']
	} ]
});
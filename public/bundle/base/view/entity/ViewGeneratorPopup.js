Ext.define('Base.view.entity.ViewGeneratorPopup', {
	
	extend : 'Base.abstract.Popup',

	xtype : 'base_view_generator_popup',
	
	title : T('title.view_generation'),
	
	height : 380,
	
	items : [ {
		xtype : 'form',
		defaults : { xtype : 'textfield', anchor : '100%' },
		items : [ {
			itemId : 'entity',
			name : 'resource_name',
			fieldLabel : T('title.entity'),
			readOnly : true
		}, {
			itemId : 'bundle',
			name : 'bundle',
			fieldLabel : T('label.bundle'),
			readOnly : true
		}, {
			name : 'view_type',
			fieldLabel : T('label.view_type'),
			xtype : 'combo',
			store : Ext.create('Ext.data.Store', {
			    fields: ['name', 'value'],
			    data : [
					{'name' : 'LIST', 'value' : 'list'},
					{'name' : 'DETAIL', 'value' : 'detail'},
					{'name' : 'REPORT', 'value' : 'report'}
			    ]
			}),
			queryMode: 'local',
			displayField: 'name',
			valueField: 'value',
			value : 'list'
		}, {
			name : 'detail_view_type',
			fieldLabel : T('label.detail_view_type'),
			xtype : 'combo',
			store : Ext.create('Ext.data.Store', {
			    fields: ['name', 'value'],
			    data : [
					{'name' : 'NONE', 'value' : 'none'},
					{'name' : 'VIEW', 'value' : 'view'},
					{'name' : 'POPUP', 'value' : 'popup'}
			    ]
			}),
			queryMode: 'local',
			displayField: 'name',
			valueField: 'value',
			value : 'popup'
		}, {
			name : 'skip_store',
			fieldLabel : T('label.skip_store'),
			xtype : 'checkbox',
			inputValue : true
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
		var entityItem = this.child('form #entity');
		entityItem.setValue(record.get('name'));
		var bundleItem = this.child('form #bundle');
		bundleItem.setValue(record.get('bundle'));
	},
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'generate', 'close']
	} ]
});
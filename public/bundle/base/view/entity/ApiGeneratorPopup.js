Ext.define('Base.view.entity.ApiGeneratorPopup', {
	
	extend : 'Base.abstract.Popup',

	xtype : 'base_api_generator_popup',
	
	title : T('title.api_generation'),
	
	height : 300,
	
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
			name : 'id_type',
			fieldLabel : T('label.id_type'),
			xtype : 'combo',
			store : Ext.create('Ext.data.Store', {
			    fields: ['name', 'value'],
			    data : [
					{'name' : 'UUID', 'value' : 'uuid'},
					{'name' : 'Meaningful (domain_id + name)', 'value' : 'meaningful'},
					{'name' : 'Auto Increment', 'value' : 'auto-increment'},
					{'name' : 'None', 'value' : 'none'}
			    ]
			}),
			queryMode: 'local',
			displayField: 'name',
			valueField: 'value',
			value : 'meaningful'
		}, {
			name : 'history_option',
			fieldLabel : T('label.history_option'),
			xtype : 'checkbox',
			inputValue : true,
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
Ext.define('Base.view.diy_report.DiyReportTest', {
	
	extend : 'Ext.panel.Panel',
	
	xtype : 'base_diy_report_test',
	
	title : T('title.test'),
	
	autoScroll : true,
	
	layout : {
		type : 'border'
	},
	
	items : [ { 
		region : 'north', 
		itemId : 'invoke_url'
	}, {
		region : 'center',
		xtype : 'form',
		itemId : 'params',
		defaults : { xtype : 'textfield', anchor : '100%' },
		layout : { type : 'vbox', align : 'stretch' }
	} ],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'back', 'invoke']
	} ],
	
	setRecord : function(record) {
		var invokeUrlView = this.child('#invoke_url');
		invokeUrlView.html = 'Invoke URL : ' + record.get('service_url');
		var paramsView = this.child('#params');
		paramsView.removeAll();
		
		paramsView.add({
			xtype: 'fieldset',
			itemId : 'parameters',
			title: 'Parameters',
			defaultType: 'textfield',
			defaults: {
				anchor : '100%'
			}
		});
		
		var inParams = record.get('service_in_params');
		var paramsFieldSet = paramsView.child('#parameters');
		Ext.Array.each(inParams, function(inParam) {
			paramsFieldSet.add({xtype : 'textfield', name : 'input[' + inParam.name + ']', fieldLabel : inParam.name });
		});
	},
	
	showResult : function(outParams, dataList) {
		var fields = [];
		var columns = [];
		Ext.Array.each(outParams, function(outParam) {
			fields.push(outParam.name);
			columns.push({dataIndex : outParam.name, header : outParam.name});
		});
		var gridItem = {
			xtype : 'gridpanel',
			itemId : 'result_grid',
			store : Ext.create('Ext.data.Store', {
				fields : fields,
				data : dataList
			}),
			columns : columns
		};
		Ext.create('Base.abstract.Popup', {
			title : 'Service Result',
			items : gridItem
		}).show();
	}
});
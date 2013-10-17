Ext.define('Base.view.tracer.Tracer', {
	extend: 'Base.abstract.Panel',

	xtype: 'base_tracer',

	title: T('title.tracer'),

	layout : {
		align : 'stretch',
		type : 'vbox'
	},
	
	dockedItems: [{
		xtype: 'controlbar',
		items: ['delete', '->', 'close']
		// items: ['delete', 'report', '->', 'close']
	}],

	initComponent : function() {
		this.items = [
			this.buildList(),
			{
				xtype : 'splitter',
				height : 5
			},
			this.buildDetail()
		];
		
		this.callParent();
	},
	
	buildList : function(self) {
		return {
			xtype : 'container',
			flex : 1,
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items: [{
				xtype: 'grid',
				store: 'Base.store.Tracer',
				flex : 1,
				autoScroll : true,
				selModel: {
					selType : 'checkboxmodel',
					headerWidth : 30
				},
				multiSelect : true,
				columns: [{
					xtype : 'rownumberer',
					width : 45
				},{
					text: T('label.issued_at'),
					dataIndex: 'issued_at',
					width : 120
				}, {
					text: T('label.issued_by'),
					dataIndex: 'issued_by',
					align : 'center',
					renderer : function(v) {
						return T('label.issued_by_' + v);
					}
				}, {
					text: T('label.severity'),
					dataIndex: 'severity',
					align : 'center',
					renderer : function(v) {
						return T('label.severity_' + v);
					}
				}, {
					text: T('label.message'),
					dataIndex: 'message',
					flex: 1
				}]
			}]
		};
	},
	
	buildDetail : function(self) {
		return {
			xtype : 'container',
			flex : 1,
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [ {
				xtype : 'component',
				itemId : 'detailview',
				cls : 'detailTrace',
				tpl : [
					'<div class="title"><span class="type {severity}">{severity}</span>{message}<span class="info">{issued_at}, {[T(\'label.issued_by\')]} : {[T(\'label.issued_by_\' + values.issued_by)]}</span></div>',
					'<div class="sourceClass"><span>- {[T(\'label.source_class\')]} : <b>{source_class}</b></span><span>- {[T(\'label.source_method\')]} : <b>{source_method}</b></span></div>',
				]
			}, {
				xtype : 'tabpanel',
				flex : 1,
				items : [ {
					xtype : 'component',
					title : T('title.client_trace'),
					autoScroll : true,
					tpl : [
						'<div class="content">{[Ext.util.Format.nl2br(values.trace)]}</div>'
					]
				}, {
					xtype : 'component',
					title : T('title.request_params'),
					autoScroll : true,
					tpl : [
						'<div class="content">{[Ext.util.Format.nl2br(values.server_params)]}</div>'
					]
				}, {
					xtype : 'component',
					title : T('title.server_trace'),
					autoScroll : true,
					tpl : [
						'<div class="content">{server_throwable_type}</div></br>',
						'<div class="content">{server_throwable_message}</div></br>',
						'<div class="content">{[Ext.util.Format.nl2br(values.server_throwable_trace)]}</div>'
					]
				} ]
			} ]
		};
	}
});

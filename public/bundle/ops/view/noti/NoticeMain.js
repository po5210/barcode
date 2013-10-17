/**
 * Notice Main
 */
Ext.define('Ops.view.noti.NoticeMain', {
	
	extend : 'Base.abstract.Panel',

	xtype : 'ops_noti_main',
	
	title : T('title.notice'),
	
	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	items : [ {
		xtype : 'grid',
		flex : 1,
		scroll : true,
		store : Ext.create('Prod.store.Notice'),
		columns : [ {
			xtype : 'datecolumn',
			header : T('label.work_date'),
			dataIndex : 'work_date',
			format : T('format.date'),
			align : 'center',
			width : 140
		}, {
			xtype : 'datecolumn',
			header : T('label.time'),
			dataIndex : 'created_at',
			format : T('format.time'),
			align : 'center',
			width : 140
		}, {
			header : T('label.operation'),
			dataIndex : 'operation',
			width : 120,
			renderer : function(val) {
				return val.name;
			}
		}, {
			header : T('label.message'),
			dataIndex : 'msg',
			flex : 2
		}, {
			xtype : 'actioncolumn',
			icon: 'theme/imageOPS/btnDetail.png',
			itemId : 'noti_report',
			align : 'center',
			width : 65
		} ]
	} ]
});

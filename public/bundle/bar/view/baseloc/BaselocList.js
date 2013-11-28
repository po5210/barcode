Ext.define('Bar.view.baseloc.BaselocList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'bar_baseloc_list',
		
	store : 'Bar.store.Baseloc',
	
	useDetailBtn : false,
	
	columns : [
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ header : T('label.domain_id'), dataIndex : 'domain_id', sortable : false,  hidden : true },
		{ header : T('label.code'), dataIndex : 'name' , sortOption : { sortSeq : 10, sortDirection : 'asc' } },
		{ header : T('label.name'), dataIndex : 'description' },
		{ header : T('label.baseloc_fg'), dataIndex : 'baseloc_fg', allowBlank : false, xtype : 'codecolumn', tpl : '{description}', commonCode : 'WH_TYPE' },
		{ header : T('label.div_cd'), dataIndex : 'div_cd' },
		{ header : T('label.inloc_cd'), dataIndex : 'inloc_cd' },
		{ header : T('label.outloc_cd'), dataIndex : 'outloc_cd' },
		{ header : T('label.baseloc_nmk'), dataIndex : 'baseloc_nmk' },
		{ header : T('label.use_yn'), dataIndex : 'use_yn', xtype : 'codecolumn', tpl : '{description}', commonCode : 'USE_YN' },
		{ header : 'cud flag', dataIndex : '_cud_flag_', hidden : true, sortable : false, width : 0, value : '' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'add', 'update', 'delete']
	} ]
});
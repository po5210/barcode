Ext.define('Bar.view.bar_locgrp.BarLocgrpList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'bar_bar_locgrp_list',
		
	store : 'Bar.store.BarLocgrp',
	
	useDetailBtn : false,
	
	columns : [
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ header : T('label.domain_id'), dataIndex : 'domain_id', sortable : false,  hidden : true },
		{ header : T('label.code'), dataIndex : 'name' , align:'center', sortOption : { sortSeq : 10, sortDirection : 'asc' } },
		{ header : T('label.name'), dataIndex : 'description' , flex : 1, sortOption : { sortSeq : 20, sortDirection : 'asc' } },
		{ header : T('label.use_yn'), dataIndex : 'use_yn', align : 'center', xtype : 'codecolumn', tpl : '{description}', commonCode : 'USE_YN' , sortOption : { sortSeq : 30, sortDirection : 'asc' } },
/*	
		{ header : T('label.baseloc_fg'), dataIndex : 'baseloc_fg', hidden : true },
		{ header : T('label.div_cd'), dataIndex : 'div_cd', hidden : true },
		{ header : T('label.inloc_cd'), dataIndex : 'inloc_cd', hidden : true },
		{ header : T('label.outloc_cd'), dataIndex : 'outloc_cd', hidden : true },
		{ header : T('label.baseloc_nmk'), dataIndex : 'baseloc_nmk', hidden : true },
*/				
		{ header : 'cud flag', dataIndex : '_cud_flag_', hidden : true, sortable : false, width : 0, value : '' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'add', 'update', 'delete']
	} ]
});
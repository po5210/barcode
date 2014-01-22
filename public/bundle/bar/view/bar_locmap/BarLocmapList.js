Ext.define('Bar.view.bar_locmap.BarLocmapList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'bar_bar_locmap_list',
		
	store : 'Bar.store.BarLocmap',
	
	useDetailBtn : false,
	
	columns : [
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ header : T('label.domain_id'), dataIndex : 'domain_id', sortable : false,  hidden : true },
		{ header : T('title.bar_locgrp'), dataIndex : 'bar_locgrp', align:'center', xtype : 'entitycolumn' , sortOption : { sortSeq : 10, sortDirection : 'asc' } },
		{ header : T('label.bar_locgrp_desc'), dataIndex : 'bar_locgrp', flex : 1, renderer : function(val) {return val ? val.desc : '';} },
		{ header : T('label.code'), dataIndex : 'name' , align:'center', sortOption : { sortSeq : 20, sortDirection : 'asc' } },
		{ header : T('label.name'), dataIndex : 'description' , flex : 1, sortOption : { sortSeq : 30, sortDirection : 'asc' } },		
		{ header : T('label.prod_line_fg'), dataIndex : 'prod_line_fg', align:'center', xtype : 'codecolumn', tpl : '{description}', commonCode : 'LOC_TYPE' , sortOption : { sortSeq : 50, sortDirection : 'asc' } },
		{ header : T('label.use_yn'), dataIndex : 'use_yn', align:'center', xtype : 'codecolumn', tpl : '{description}', commonCode : 'USE_YN' , sortOption : { sortSeq : 40, sortDirection : 'asc' } },
		{ header : 'cud flag', dataIndex : '_cud_flag_', hidden : true, sortable : false, width : 0, value : '' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'add', 'update', 'delete']
	} ]
});
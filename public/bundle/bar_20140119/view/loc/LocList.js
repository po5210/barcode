Ext.define('Bar.view.loc.LocList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'bar_loc_list',
		
	store : 'Bar.store.Loc',
	
	useDetailBtn : false,
	
	columns : [
		{ header : T('label.baseloc_cd'), dataIndex : 'baseloc_cd' , sortOption : { sortSeq : 10, sortDirection : 'asc' } },
		{ header : T('label.loc_cd'), dataIndex : 'loc_cd' , sortOption : { sortSeq : 20, sortDirection : 'asc' } },
		{ header : T('label.use_yn'), dataIndex : 'use_yn' , sortOption : { sortSeq : 40, sortDirection : 'asc' } },
		{ header : T('label.prod_line_fg'), dataIndex : 'prod_line_fg' , sortOption : { sortSeq : 30, sortDirection : 'asc' } },
		{ header : 'cud flag', dataIndex : '_cud_flag_', hidden : true, sortable : false, width : 0, value : '' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'add', 'update', 'delete']
	} ]
});
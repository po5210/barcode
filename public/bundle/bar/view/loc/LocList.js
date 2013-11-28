Ext.define('Bar.view.loc.LocList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'bar_loc_list',
		
	store : 'Bar.store.Loc',
	
	useDetailBtn : false,
	
	columns : [
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ header : T('label.domain_id'), dataIndex : 'domain_id', sortable : false,  hidden : true },
		{ header : T('label.name'), dataIndex : 'name' , sortOption : { sortSeq : 10, sortDirection : 'asc' } },
		{ header : T('label.description'), dataIndex : 'description' },
		{ header : T('title.baseloc'), dataIndex : 'baseloc', xtype : 'entitycolumn' },
		{ header : T('label.loc_nmk'), dataIndex : 'loc_nmk' },
		{ header : T('label.prod_line_fg'), dataIndex : 'prod_line_fg', xtype : 'codecolumn', tpl : '{description}', commonCode : 'PROD_LINE_TYPE' },
		{ header : T('label.erp_bloc'), dataIndex : 'erp_bloc' },
		{ header : T('label.erp_loc'), dataIndex : 'erp_loc' },
		{ header : T('label.tmp_bloc'), dataIndex : 'tmp_bloc' },
		{ header : T('label.tmp_loc'), dataIndex : 'tmp_loc' },
		{ header : T('label.use_yn'), dataIndex : 'use_yn', xtype : 'codecolumn', tpl : '{description}', commonCode : 'USE_YN' },
		{ header : 'cud flag', dataIndex : '_cud_flag_', hidden : true, sortable : false, width : 0, value : '' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'add', 'update', 'delete']
	} ]
});
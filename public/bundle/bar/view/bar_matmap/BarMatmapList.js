Ext.define('Bar.view.bar_matmap.BarMatmapList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'bar_bar_matmap_list',
		
	store : 'Bar.store.BarMatmap',
	
	useDetailBtn : false,
	
	columns : [
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ header : T('label.domain_id'), dataIndex : 'domain_id', sortable : false,  hidden : true },
		{ header : T('label.code'), dataIndex : 'name' , align:'center', sortOption : { sortSeq : 10, sortDirection : 'asc' } },
		{ header : T('label.name'), dataIndex : 'description' , flex :1, sortOption : { sortSeq : 20, sortDirection : 'asc' } },
		{ header : T('title.supplier'), dataIndex : 'supplier', align:'center', xtype : 'entitycolumn' , sortOption : { sortSeq : 30, sortDirection : 'asc' } },
		{ header : T('label.supplier_desc'), dataIndex : 'supplier', flex :1, renderer : function(val) {return val ? val.desc : '';} },
		{ header : T('label.box_qty'), dataIndex : 'box_qty', xtype : 'numbercolumn', format : T('format.number'), align : 'right' },
		{ header : 'cud flag', dataIndex : '_cud_flag_', hidden : true, sortable : false, width : 0, value : '' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'add', 'update', 'delete']
	} ]
});
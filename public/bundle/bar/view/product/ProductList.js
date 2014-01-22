Ext.define('Bar.view.product.ProductList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'bar_product_list',
		
	store : 'Bar.store.Product',
	
	useDetailBtn : false,
	
	columns : [
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ header : T('label.domain_id'), dataIndex : 'domain_id', sortable : false,  hidden : true },
		{ header : T('label.code'), dataIndex : 'name' , sortOption : { sortSeq : 10, sortDirection : 'asc' } },
		{ header : T('label.name'), dataIndex : 'description' , width : 300, sortOption : { sortSeq : 20, sortDirection : 'asc' } },
		{ header : T('label.unit'), dataIndex : 'unit' , width : 50, sortOption : { sortSeq : 30, sortDirection : 'asc' }, align : 'center'  },
		{ header : T('label.default_qty'), dataIndex : 'default_qty', xtype : 'numbercolumn', format : T('format.number'), align : 'right' , sortOption : { sortSeq : 40, sortDirection : 'asc' } },
		{ header : T('title.bar_locgrp'), dataIndex : 'bar_locgrp', width : 60, xtype : 'entitycolumn' , sortOption : { sortSeq : 50, sortDirection : 'asc' }, align : 'center' },
		{ header : T('label.bar_locgrp_desc'), dataIndex : 'bar_locgrp', flex :1, renderer : function(val) {return val ? val.desc : '';} },
		{ header : T('title.bar_locmap'), dataIndex : 'bar_locmap', width : 60, xtype : 'entitycolumn' , sortOption : { sortSeq : 60, sortDirection : 'asc' }, align : 'center' },
		{ header : T('label.bar_locmap_desc'), dataIndex : 'bar_locmap', flex :1, renderer : function(val) {return val ? val.desc : '';} },
		{ header : T('label.routing'), dataIndex : 'routing', width : 60, sortOption : { sortSeq : 70, sortDirection : 'asc' }, align : 'center' },
		{ header : T('label.use_yn'), dataIndex : 'use_yn', width : 60, xtype : 'codecolumn', tpl : '{description}', commonCode : 'USE_YN', align : 'center' , sortOption : { sortSeq : 60, sortDirection : 'asc' } },
		{ header : 'cud flag', dataIndex : '_cud_flag_', hidden : true, sortable : false, width : 0, value : '' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'add', 'update', 'delete']
	} ]
});
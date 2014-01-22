Ext.define('Bar.view.part_group.PartGroupList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'bar_part_group_list',
		
	store : 'Bar.store.PartGroup',
	
	useDetailBtn : false,
	
	columns : [
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ header : T('label.domain_id'), dataIndex : 'domain_id', sortable : false,  hidden : true },
		{ header : T('label.code'), dataIndex : 'name' , align:'center', sortOption : { sortSeq : 10, sortDirection : 'asc' } },
		{ header : T('label.name'), dataIndex : 'description', flex:1, sortOption : { sortSeq : 20, sortDirection : 'asc' } },
		{ header : T('label.part_desc'), dataIndex : 'part_desc', flex:1 },
		{ header : 'cud flag', dataIndex : '_cud_flag_', hidden : true, sortable : false, width : 0, value : '' }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items : ['->', 'add', 'update', 'delete']
	} ]
});
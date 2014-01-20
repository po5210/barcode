Ext.define('Base.view.terminology.TerminologyList', {
	
	extend : 'Base.abstract.entity.ListGridView',
	
	xtype : 'base_terminology_list',
	
	useDetailBtn : false,
	
	selectionMode : 'SINGLE',
	
	store : 'Base.store.Terminology',
	
	columns : [
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ dataIndex : 'domain_id', hidden : true },
		{ header : T('label.name'), width : 200, dataIndex : 'name', editor : {xtype : 'textfield'}, sortOption : { sortSeq: 10, sortDirection: 'asc'} },
		{ header : T('label.description'), width : 100, dataIndex : 'description', editor : {xtype : 'textfield'} },
		{ xtype : 'codecolumn', commonCode : 'LANGUAGE', tpl : '{description}', header : T('label.locale'), width : 80, dataIndex : 'locale', editor : { xtype : 'codecombo', commonCode : 'LANGUAGE' } },
		{ xtype : 'codecolumn', commonCode : 'TERMS_CATEGORY', tpl : '{description}', header : T('label.category'), width : 80, dataIndex : 'category', editor : { xtype : 'codecombo', commonCode : 'TERMS_CATEGORY' } },
		{ header : T('label.display'), flex : 1, dataIndex : 'display', editor : {xtype : 'textfield'} },
		{ header : T('label.updater'), dataIndex : 'updater', xtype : 'entitycolumn' },
		{ header : T('label.updated_at'), width : 120, dataIndex : 'updated_at', xtype : 'datecolumn', readOnly : true, format : T('format.datetime') }
	],
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'add', 'update', 'save', 'delete']
	} ]

});
Ext.define('Bar.view.part_group.PartGroupSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'bar_part_group_search',
		
	items : [
		{ fieldLabel : T('label.code'), name : 'name-like' },
		{ fieldLabel : T('label.name'), name : 'description-like' },
	]
	
});
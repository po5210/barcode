Ext.define('Base.view.common_code.CommonCode', {
	
	extend: 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'Base.view.common_code.CommonCodeSearch',
		'Base.view.common_code.CommonCodeList',
		'Base.view.common_code.SubCodeList'
	],
	
	xtype : 'base_common_code',
	
	title : T('title.common_code'),
	
	searchView : 'base_common_code_search',
	
	gridView : 'base_common_code_list',
	
	subView : 'base_sub_code_list'
	
});
Ext.define('Base.view.diy_selection.DiySelectionDetail', {
	
	extend : 'Base.abstract.entity.DetailMainView',
	
 	requires : [ 
		'Base.view.diy_selection.DiySelectionForm',
		'Base.view.diy_selection.DiySelectionInParams',
		'Base.view.diy_selection.DiySelectionOutParams',
		'Base.view.diy_selection.DiySelectionTest'
	],
	
	xtype : 'base_diy_selection_detail',
	
	title : T('title.entity_details', {entity : T('title.diy_selection')}),
	
	items : [ {
		xtype : 'base_diy_selection_form'
	}, {
		xtype : 'base_diy_selection_in_params_list'
	}, {
		xtype : 'base_diy_selection_out_params_list'
	}, {
		xtype : 'base_diy_selection_test'
	} ]
});
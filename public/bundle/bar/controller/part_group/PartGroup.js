/**
 * PartGroup controller
 */
Ext.define('Bar.controller.part_group.PartGroup', {
	
	extend: 'Base.abstract.entity.ListMainController',
	
	requires : [ 
		'Bar.model.PartGroup', 
		'Bar.store.PartGroup', 
		'Bar.view.part_group.PartGroup' 
	],
	
	models : ['Bar.model.PartGroup'],
			
	stores: ['Bar.store.PartGroup'],
	
	views : ['Bar.view.part_group.PartGroup'],
	
	refs: [ { ref : 'PartGroup', selector : 'bar_part_group' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'bar_part_group' : {
				paramschange : this.onParamsChange,
				after_import : this.onImportSuccess
			},
			'bar_part_group_list' : {
				click_add : this.onPopupNew,
				click_save : this.onGridSave,
				click_delete : this.onGridDelete,
				click_import : this.onImport,
				click_export : this.onExport,
				after_grid_updated : this.afterGridUpdated,
				click_update : this.onInquiryDetail
			},
			'bar_part_group_search' : {
				click_search : this.onSearchClick,
				click_reset : this.onResetClick
			},
			'bar_part_group_list #go_detail' : {
				click : this.onShowDetail
			}
		});
	},

	/****************************************************************
	 ** 			여기는 customizing area 						   **
	 ****************************************************************/
	/**
	 * after import success
	 */
	onImportSuccess : function(response) {
		var gridView = this.getGridView();
		gridView.store.load();
	},
			
	/****************************************************************
	 ** 			여기서 부터는 abstract method, 필수 구현 				   **
	 ****************************************************************/
	onPopupNew : function() {
		HF.popup(this.getDetailViewName(), {}, {});
	},

	/**
	 * detail view type(popup | view | none)을 리턴
	 */	
	getDetailViewType : function() {
		return 'popup';
	},
	
	/**
	 * main view를 리턴 
	 */
	getMainView : function() {
		return this.getPartGroup();
	}
});
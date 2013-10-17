/**
 * DiyReport controller
 */
Ext.define('Base.controller.diy_report.DiyReport', {
	
	extend: 'Base.abstract.entity.ListMainController',
	
	requires : [ 
		'Base.model.DiyReport', 
		'Base.store.DiyReport', 
		'Base.view.diy_report.DiyReport' 
	],
	
	models : ['Base.model.DiyReport'],
			
	stores: ['Base.store.DiyReport'],
	
	views : ['Base.view.diy_report.DiyReport'],
	
	refs: [ { ref : 'DiyReport', selector : 'base_diy_report' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'base_diy_report' : {
				paramschange : this.onParamsChange
			},
			'base_diy_report_list' : {
				click_add :  this.onGridAdd,
				click_save :  this.onGridSave,
				click_delete : this.onGridDelete,
				click_import : this.onImport,
				click_export : this.onExport,
				after_grid_updated : this.afterGridUpdated
			},
			'base_diy_report_search' : {
				click_search : this.onSearchClick,
				click_reset : this.onResetClick
			},
			'base_diy_report_list #go_detail' : {
				click : this.onShowDetail
			}
		});
	},

	/****************************************************************
	 ** 			여기는 customizing area 						   **
	 ****************************************************************/
	// Customized code here ...
		
	/****************************************************************
	 ** 			여기서 부터는 abstract method, 필수 구현 				   **
	 ****************************************************************/
	/**
	 * detail view type(popup | view | none)을 리턴
	 */	
	getDetailViewType : function() {
		return 'view';
	},
	
	/**
	 * main view를 리턴 
	 */
	getMainView : function() {
		return this.getDiyReport();
	}
});
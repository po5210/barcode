/**
 * DiyService controller
 */
Ext.define('Base.controller.diy_service.DiyService', {
	
	extend: 'Base.abstract.entity.ListMainController',
	
	requires : [ 
		'Base.model.DiyService', 
		'Base.store.DiyService', 
		'Base.view.diy_service.DiyService' 
	],
	
	models : ['Base.model.DiyService'],
			
	stores: ['Base.store.DiyService'],
	
	views : ['Base.view.diy_service.DiyService'],
	
	refs: [ { ref : 'DiyService', selector : 'base_diy_service' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'base_diy_service' : {
				paramschange : this.onParamsChange
			},
			'base_diy_service_list' : {
				click_add :  this.onGridAdd,
				click_save :  this.onGridSave,
				click_delete : this.onGridDelete,
				click_import : this.onImport,
				click_export : this.onExport,
				after_grid_updated : this.afterGridUpdated
			},
			'base_diy_service_list #go_detail' : {
				click : this.onShowDetail
			},
			'base_diy_service_search' : {
				click_search : this.onSearchClick,
				click_reset : this.onResetClick
			}
		});
	},
	
	/****************************************************************
	 ** 					abstract method, 필수 구현 				   **
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
		return this.getDiyService();
	}
});
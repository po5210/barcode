/**
 * Role controller
 * View Type1 : grid - search
 */
Ext.define('Base.controller.role.Role', {
	
	extend: 'Base.abstract.entity.ListMainController',
	
	requires : [ 
		'Base.model.Role', 
		'Base.store.Role', 
		'Base.view.role.Role' 
	],
	
	models : ['Base.model.Role'],
			
	stores: ['Base.store.Role'],
	
	views : ['Base.view.role.Role'],
	
	refs: [ { ref : 'Role', selector : 'base_role' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'base_role' : {
				paramschange : this.onParamsChange
			},
			'base_role_list' : {
				click_add :  this.onGridAdd,
				click_save :  this.onGridSave,
				click_delete : this.onGridDelete,
				click_import : this.onImport,
				click_export : this.onExport,
				after_grid_updated : this.afterGridUpdated
			},
			'base_role_search' : {
				click_search : this.onSearchClick,
				click_reset : this.onResetClick
			},
			'base_role_list #go_detail' : {
				click : this.onShowDetail
			}
		});
	},
	
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
		return this.getRole();
	}
});
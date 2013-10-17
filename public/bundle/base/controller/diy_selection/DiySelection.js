/**
 * DiySelection controller
 */
Ext.define('Base.controller.diy_selection.DiySelection', {
	
	extend: 'Base.abstract.entity.ListMainController',
	
	requires : [ 
		'Base.model.DiySelection', 
		'Base.store.DiySelection', 
		'Base.view.diy_selection.DiySelection' 
	],
	
	models : ['Base.model.DiySelection'],
			
	stores: ['Base.store.DiySelection'],
	
	views : ['Base.view.diy_selection.DiySelection'],
	
	refs: [ { ref : 'DiySelection', selector : 'base_diy_selection' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'base_diy_selection' : {
				paramschange : this.onParamsChange
			},
			'base_diy_selection_list' : {
				click_add :  this.onGridAdd,
				click_new :  this.onNewForm,
				click_save :  this.onGridSave,
				click_delete : this.onGridDelete,
				click_import : this.onImport,
				click_export : this.onExport,
				after_grid_updated : this.afterGridUpdated
			},
			'base_diy_selection_list #go_detail' : {
				click : this.onShowDetail
			},
			'base_diy_selection_search' : {
				click_search : this.onSearchClick,
				click_reset : this.onResetClick
			}
		});
	},
	
	/**
	 * form을 새로 생성 ...
	 */
	onNewForm : function() {
		HF.show(this.getDetailViewName(), {id : ''});
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
		return this.getDiySelection();
	}
});
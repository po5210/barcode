/**
 * Terminology controller
 */
Ext.define('Base.controller.terminology.Terminology', {
	
	extend: 'Base.abstract.entity.ListMainController',
	
	models : ['Base.model.Terminology'],
			
	stores: ['Base.store.Terminology'],
	
	views : ['Base.view.terminology.Terminology'],
	
	refs: [ { ref : 'Terminology', selector : 'base_terminology' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'base_terminology' : {
				paramschange : this.onParamsChange
			},
			'base_terminology_list' : {
				click_add :  this.onGridAdd,
				click_new :  this.onNewForm,
				click_save : this.onGridSave,
				click_delete : this.onGridDelete,
				click_export : this.onExport,
				after_grid_updated : this.afterGridUpdated,
				click_update : this.onInquiryDetail
			},
			'base_terminology_list #go_detail' : {
				click : this.onShowDetail
			},
			'base_terminology_list #slideshow' : {
				click : this.onSlideShow
			},
			'base_terminology_search' : {
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
	 * entity 복수형을 리턴 
	 */
	getMultipleEntityName : function(singleEntityName) {
		return 'terminologies';
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
		return this.getTerminology();
	}
});
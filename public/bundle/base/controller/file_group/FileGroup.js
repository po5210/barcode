/**
 * FileGroup controller
 */
Ext.define('Base.controller.file_group.FileGroup', {
	
	extend: 'Base.abstract.entity.ListMainController',
	
	models : ['Base.model.FileGroup', 'Base.model.FileGroupWithAttachments'],
			
	stores: ['Base.store.FileGroup'],
	
	views : ['Base.view.file_group.FileGroup'],
	
	refs: [ { ref : 'FileGroup', selector : 'base_file_group' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'base_file_group' : {
				paramschange : this.onParamsChange
			},
			'base_file_group_list' : {
				click_add :  this.onGridAdd,
				click_new :  this.onNewForm,
				click_save : this.onGridSave,
				click_delete : this.onGridDelete,
				click_export : this.onExport,
				after_grid_updated : this.afterGridUpdated,
				click_update : this.onInquiryDetail
			},
			'base_file_group_list #go_detail' : {
				click : this.onShowDetail
			},
			'base_file_group_list #slideshow' : {
				click : this.onSlideShow
			},
			'base_file_group_search' : {
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
	
	onSlideShow : function(grid, item, rowIndex, colIndex, e, record) {
		Ext.ModelManager.getModel('Base.model.FileGroupWithAttachments').load(record.get('id'), {
		    success: function(file_group) {
				HF.slideshow(file_group.data.attachments);
		    },
			scope : this
		});
	},
			
	/****************************************************************
	 ** 			여기서 부터는 abstract method, 필수 구현 				   **
	 ****************************************************************/
	
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
		return this.getFileGroup();
	}
});
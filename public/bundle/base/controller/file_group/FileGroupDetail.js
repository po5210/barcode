/**
 * FileGroupDetail controller
 */
Ext.define('Base.controller.file_group.FileGroupDetail', {
	
	extend : 'Base.abstract.entity.PopupFormController',
	
	models : ['Base.model.FileGroupWithAttachments'],
			
	stores: ['Base.store.Attachment'],
	
	views : ['Base.view.file_group.FileGroupDetail', 'Base.view.common.AttachmentGrid'],
	
	refs: [{
		ref : 'FileGroupDetail',
		selector : 'base_file_group_detail'
	}],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'base_file_group_detail' : {
				paramschange : this.onParamsChange,
				after_detail_loaded : this.afterDetailLoaded,
				click_close : this.onClickClose
			}
		});
	},
	
	/****************************************************************
	 ** 					여기는 customizing area 				   **
	 ****************************************************************/
	
	/****************************************************************
	 ** 					Override 구현 						   **
	 ****************************************************************/

	onParamsChange : function(view, params) {
		this.callParent(arguments);
		view.down('attachment_grid').setFileGroupId(params.id);
	},

	afterDetailLoaded : function(record, operation) {
		var grid = this.getMainView().down('attachment_grid');
		grid.getStore().loadData(record.get('attachments'));
	},

	/****************************************************************
	 ** 					abstract method, 필수 구현 				   **
	 ****************************************************************/
	/**
	 * main view를 리턴 
	 */
	getMainView : function() {
		return this.getFileGroupDetail();
	},
	
	/**
	 * 팝업 close
	 */
	onClickClose : function(view) {
		view.close();
	}
});

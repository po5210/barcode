/**
 * Attachment controller
 */
Ext.define('Base.controller.attachment.Attachment', {
	
	extend: 'Base.abstract.entity.ListMainController',
	
	models : ['Base.model.Attachment'],
			
	stores: ['Base.store.Attachment'],
	
	views : ['Base.view.attachment.Attachment'],
	
	refs: [ { ref : 'Attachment', selector : 'base_attachment' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'base_attachment' : {
				paramschange : this.onParamsChange
			},
			'base_attachment_list' : {
				click_add : this.onPopupNew,
				click_save : this.onGridSave,
				click_delete : this.onGridDelete,
				click_export : this.onExport,
				after_grid_updated : this.afterGridUpdated,
				click_inquiry : this.onInquiryDetail
			},
			'base_attachment_search' : {
				click_search : this.onSearchClick,
				click_reset : this.onResetClick
			}
		});
	},
	
	/**
	 * form을 새로 생성 ...
	 */
	onPopupNew : function() {
		HF.show(this.getDetailViewName(), {id : ''});
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
		return this.getAttachment();
	}
});
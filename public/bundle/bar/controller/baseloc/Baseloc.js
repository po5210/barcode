/**
 * Baseloc controller
 */
Ext.define('Bar.controller.baseloc.Baseloc', {
	
	extend: 'Base.abstract.entity.ListMainController',
	
	requires : [ 
		'Bar.model.Baseloc', 
		'Bar.store.Baseloc', 
		'Bar.view.baseloc.Baseloc' 
	],
	
	models : ['Bar.model.Baseloc'],
			
	stores: ['Bar.store.Baseloc'],
	
	views : ['Bar.view.baseloc.Baseloc'],
	
	refs: [ { ref : 'Baseloc', selector : 'bar_baseloc' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'bar_baseloc' : {
				paramschange : this.onParamsChange,
				after_import : this.onImportSuccess
			},
			'bar_baseloc_list' : {
				click_add : this.onPopupNew,
				click_save : this.onGridSave,
				click_delete : this.onGridDelete,
				click_import : this.onImport,
				click_export : this.onExport,
				after_grid_updated : this.afterGridUpdated,
				click_update : this.onInquiryDetail
			},
			'bar_baseloc_search' : {
				click_search : this.onSearchClick,
				click_reset : this.onResetClick
			},
			'bar_baseloc_list #go_detail' : {
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
	
	/**
	 * delete button click
	 */			
	onGridDelete : function(view) {
		var selections = view.getSelectionModel().getSelection();
		if(selections.length > 0) {
			HF.msg.confirm({
				msg : T('text.Sure to Delete'),
				fn : function(confirmBtn) {
					if(confirmBtn == 'yes') {
						var record = Ext.create('Bar.model.Baseloc', {id : selections[0].data.id});
						record.destroy({
							success: function(record, operation) {
								view.fireEvent('after_grid_updated', view, 'd', operation);
							}
						});
					}
				},
				scope : this
			});
		} else {
			HF.msg.notice(T('text.Nothing selected'));
		}		
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
		return this.getBaseloc();
	}
});
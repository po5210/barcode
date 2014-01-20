/**
 * Loc controller
 */
Ext.define('Bar.controller.invoice.Invoice', {
	
	extend: 'Base.abstract.entity.ListMainController',
	
	requires : [ 
		'Bar.model.Invoice', 
		'Bar.store.Invoice', 
		'Bar.view.invoice.Invoice' 
	],
	
	models : ['Bar.model.Invoice'],
			
	stores: ['Bar.store.Invoice'],
	
	views : ['Bar.view.invoice.Invoice'],
	
	refs: [ { ref : 'Invoice', selector : 'bar_invoice' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'bar_invoice' : {
				paramschange : this.onParamsChange,
				after_import : this.onImportSuccess
			},
			'bar_invoice_list' : {
				click_add : this.onPopupNew,
				click_save : this.onGridSave,
				click_delete : this.onGridDelete,
				click_import : this.onImport,
				click_export : this.onExport,
				after_grid_updated : this.afterGridUpdated,
				click_update : this.onInquiryDetail
			},
			'bar_invoice_search' : {
				click_search : this.onSearchClick,
				click_reset : this.onResetClick
			},
			'bar_invoice_list #go_detail' : {
				click : this.onShowDetail
			}
		});
	},

	/****************************************************************
	 ** 			여기는 customizing area 						   **
	 ****************************************************************/
	/**
	 * entry point
	 *
	 * @return
	 */	
	onParamsChange: function(view, params) {
		/*params = this.beforeParamsChange(view, params);
		if(this.validateParams(view, params)) {
			var searchForm = this.getSearchForm();
			searchForm.setValues(params);
			this.reload(view.child('grid'), searchForm.getValues());
		}*/
	},
		
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
						var record = Ext.create('Bar.model.Invoice', {id : selections[0].data.id});
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
		return this.getInvoice();
	}
});
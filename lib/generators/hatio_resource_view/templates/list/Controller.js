/**
 * <%= class_name %> controller
 */
Ext.define('<%= @bundle %>.controller.<%= singular_name %>.<%= class_name %>', {
	
	extend: 'Base.abstract.entity.ListMainController',
	
	requires : [ 
		'<%= @bundle %>.model.<%= class_name %>', 
		'<%= @bundle %>.store.<%= class_name %>', 
		'<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>' 
	],
	
	models : ['<%= @bundle %>.model.<%= class_name %>'],
			
	stores: ['<%= @bundle %>.store.<%= class_name %>'],
	
	views : ['<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>'],
	
	refs: [ { ref : '<%= class_name %>', selector : '<%= @bundle.downcase %>_<%= singular_name %>' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'<%= @bundle.downcase %>_<%= singular_name %>' : {
				paramschange : this.onParamsChange,
				after_import : this.onImportSuccess
			},
			'<%= @bundle.downcase %>_<%= singular_name %>_list' : {
				click_add : <%= options.detail_view_type == "popup" ? "this.onPopupNew," : "this.onGridAdd," %>
				click_save : this.onGridSave,
				click_delete : this.onGridDelete,
				click_import : this.onImport,
				click_export : this.onExport,
				after_grid_updated : this.afterGridUpdated,
				click_update : this.onInquiryDetail
			},
			'<%= @bundle.downcase %>_<%= singular_name %>_search' : {
				click_search : this.onSearchClick,
				click_reset : this.onResetClick
			},
			'<%= @bundle.downcase %>_<%= singular_name %>_list #go_detail' : {
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
			
	/****************************************************************
	 ** 			여기서 부터는 abstract method, 필수 구현 				   **
	 ****************************************************************/
	<%= options.detail_view_type == "popup" ? "onPopupNew : function() {\n\t\tHF.popup(this.getDetailViewName(), {}, {});\n\t},\n" : "" %>
	/**
	 * detail view type(popup | view | none)을 리턴
	 */	
	getDetailViewType : function() {
		return '<%= options.detail_view_type %>';
	},
	
	/**
	 * main view를 리턴 
	 */
	getMainView : function() {
		return this.get<%= class_name %>();
	}
});
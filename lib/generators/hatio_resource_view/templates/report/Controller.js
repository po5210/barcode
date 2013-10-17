/**
 * <%= class_name %> controller
 */
Ext.define('<%= @bundle %>.controller.<%= singular_name %>.<%= class_name %>', {
	
	extend: 'Base.abstract.entity.ReportMainController',
	
	requires : [
		'<%= @bundle %>.store.<%= class_name %>',
		'<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>',
		'<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>List',
		'<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>Search'
	],
	
	models : [],
			
	stores: ['<%= @bundle %>.store.<%= class_name %>'],
	
	views : ['<%= @bundle %>.view.<%= singular_name %>.<%= class_name %>'],
	
	refs: [ { ref : '<%= class_name %>', selector : '<%= @bundle.downcase %>_<%= singular_name %>' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'<%= @bundle.downcase %>_<%= singular_name %>' : {
				paramschange : this.onParamsChange
			},
			'<%= @bundle.downcase %>_<%= singular_name %>_search' : {
				click_search : this.onSearchClick,
				click_reset : this.onResetClick
			}
		});
	},
	
	/****************************************************************
	 ** 				여기는 customizing area 					   **
	 ****************************************************************/
	
	
	/****************************************************************
	 ** 			여기서 부터는 abstract method, 필수 구현 					**
	 ****************************************************************/
	/**
	 * main view를 리턴 
	 */
	getMainView : function() {
		return this.get<%= class_name %>();
	}
});
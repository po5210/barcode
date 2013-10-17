/**
 * Entity controller
 */
Ext.define('Base.controller.entity.Entity', {

	extend: 'Base.abstract.entity.ListMainController',

	requires : [ 
		'Base.model.Entity', 
		'Base.store.Entity', 
		'Base.view.entity.Entity' 
	],

	models : ['Base.model.Entity'],

	stores: ['Base.store.Entity'],

	views : ['Base.view.entity.Entity'],

	refs: [ { ref : 'Entity', selector : 'base_entity' } ],

	init: function() {
		this.callParent(arguments);

		this.control({
			'base_entity' : {
				paramschange : this.onParamsChange
			},
			'base_entity_list' : {
				click_add :  this.onGridAdd,
				click_save :  this.onGridSave,
				click_delete : this.onGridDelete,
				click_import : this.onImport,
				click_export : this.onExport,
				after_grid_updated : this.afterGridUpdated
			},
			'base_entity_search' : {
				click_search : this.onSearchClick,
				click_reset : this.onResetClick
			},
			'base_entity_list #go_detail' : {
				click : this.onShowDetail
			}
		});
	},

	/****************************************************************
	 ** 			여기는 customizing area 						   **
	 ****************************************************************/
	/**
	 * 서버로 전달되서는 안 되는 값을 제거하거나 값을 선처리한다.
	 * 
	 * @data
	 */
	validateMultipleUpdateData : function(data) {
		Ext.Array.each(['entity_columns', 'creator', 'updater', 'creator_id', 'created_at', 'updater_id', 'updated_at'], function(key) {
			delete data[key];
		});

		return data;
	},

	/****************************************************************
	 ** 			여기서 부터는 abstract method, 필수 구현 				   **
	 ****************************************************************/
	/**
	 * entity 복수형을 리턴 
	 */
	getMultipleEntityName : function(singleEntityName) {
		return 'entities';
	},

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
		return this.getEntity();
	}
});
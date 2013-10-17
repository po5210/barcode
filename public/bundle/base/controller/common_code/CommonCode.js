/**
 * CommonCode controller
 */
Ext.define('Base.controller.common_code.CommonCode', {
	
	extend: 'Base.abstract.entity.ListMainController',
	
	requires : [ 
		'Base.model.CommonCode', 
		'Base.store.CommonCode', 
		'Base.view.common_code.CommonCode' 
	],
	
	models : ['Base.model.CommonCode'],
			
	stores: ['Base.store.CommonCode', 'Base.store.SubCode'],
	
	views : ['Base.view.common_code.CommonCode'],
	
	refs: [ { ref : 'CommonCode', selector : 'base_common_code' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'base_common_code' : {
				paramschange : this.onParamsChange
			},
			'base_common_code_list' : {
				itemclick : this.onGridItemClick,
				click_add :  this.onGridAdd,
				click_save :  this.onGridSave,
				click_delete : this.onGridDelete,
				click_import : this.onImport,
				click_export : this.onExport,
				after_grid_updated : this.afterGridUpdated
			},
			'base_common_code_search' : {
				click_search : this.onSearchClick,
				click_reset : this.onResetClick
			},
			'base_common_code_list #go_detail' : {
				click : this.onShowDetail
			},
			'base_sub_code_list' : {
				click_add : this.onGridAdd,
				click_save :  this.onGridSave,
				click_delete : this.onGridDelete,
				after_grid_updated : this.afterSubGridUpdated
			}
		});
	},

	/****************************************************************
	 ** 			여기는 customizing area 						   **
	 ****************************************************************/
	/**
	 * grid click시 
	 */
	onGridItemClick : function(grid, record, item, index, e, eOpts) {
		this.selectedRecord = record;
		if(this.selectedRecord.get('id')) {
			var subCodeList = this.getSubCodeListView();
			this.reload(subCodeList, { "parent_id-eq" : record.get('id') });	
		}
	},
	
	/**
	 * reload by params
	 *
	 * @grid
	 * @params
	 * @return
	 */
	reload : function(grid, params) {
		params = params || {};
		
		if(grid.xtype == 'base_common_code_list') { 
			params['parent_id-is_blank'] = '';
		} else {
			if(!params.parent_id) {
				params['parent_id-eq'] = this.selectedRecord.get('id');
			}
		}
		
		var store = grid.store;
		store.load({
			params : this.buildGridParams(grid, params),
			success : function(records, operation) {
				grid.fireEvent('after_grid_loaded', records);
			}
		});
	},
	
	/**
	 * override
	 */
	afterSubGridUpdated : function(grid, updateType, response) {
		Ext.getStore(this.stores[1]).reload();
	},
	
	/**
	 * multiple update url을 리턴 
	 */
	getMultipleUpdateUrl : function(grid) {
		if(grid.xtype == 'base_common_code_list') { 
			return '/domains/' + login.current_domain_id + '/common_codes/update_multiple.json';
		} else {
			return '/domains/' + login.current_domain_id + '/common_codes/' + this.selectedRecord.get('id') + '/update_multiple_codes';
		}
	},
	
	/**
	 * 모델 생성
	 *
	 * @grid
	 * @data
	 */
	newModel : function(grid, data) {
		data = data || { domain_id : login.current_domain_id };		
		if(grid.xtype == 'base_common_code_list') {
			return Ext.create(this.models[0], data);
		} else {
			data.parent_id = this.selectedRecord.get('id');
			return Ext.create(this.models[0], data);
		}
	},
	
	/****************************************************************
	 ** 			여기서 부터는 abstract method, 필수 구현 				   **
	 ****************************************************************/
	
	/**
	 * detail view type(popup | view | none)을 리턴
	 */	
	getDetailViewType : function() {
		return 'none';
	},
	
	/**
	 * sub code list view를 리턴 
	 */
	getSubCodeListView : function() {
		return this.queryItem(null, 'base_sub_code_list');
	},
	
	/**
	 * main view를 리턴 
	 */
	getMainView : function() {
		return this.getCommonCode();
	}
});
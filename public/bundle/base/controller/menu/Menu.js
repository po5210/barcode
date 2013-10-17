/**
 * Menu controller
 * View Type1 : grid - search
 */
Ext.define('Base.controller.menu.Menu', {
	
	extend: 'Base.abstract.entity.ListMainController',
	
	requires : [ 
		'Base.model.Menu', 
		'Base.store.Menu', 
		'Base.view.menu.Menu' 
	],
	
	models : ['Base.model.Menu'],
			
	stores: ['Base.store.Menu'],
	
	views : ['Base.view.menu.Menu'],
	
	refs: [ { ref : 'Menu', selector : 'base_menu' } ],
	
	subGridMultiUpdateUrl : '/domains/' + login.current_domain_id + '/menus/update_multiple_submenus',
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'base_menu' : {
				paramschange : this.onParamsChange
			},
			'base_menu_list' : {
				itemclick : this.onMenuClick,
				click_add :  this.onGridAdd,
				click_save :  this.onGridSave,
				click_delete : this.onGridDelete,
				after_grid_updated : this.afterGridUpdated
			},
			'base_menu_search' : {
				click_search : this.onSearchClick,
				click_reset : this.onResetClick
			},
			'base_menu base_submenu_list' : {
				click_add : this.onGridAdd,
				click_save :  this.saveMenuGridRows,
				click_delete : this.deleteMenuGridRows,
				after_grid_updated : this.afterMenuGridUpdated
			}
		});
	},
	
	/****************************************************************
	 ** 				여기는 customizing area 					   **
	 ****************************************************************/
	/**
	 * override
	 */
	onParamsChange: function(view, params) {
		this.reload(view.child('grid'), {
			'_q[domain_id-eq]' : login.current_domain_id,
			'_q[menu_type-eq]' : 'MENU',
			'_o[rank]' : 'asc'
		});
	},
	
	/**
	 * override
	 */
	reload : function(grid, params) {
		grid.store.load({params : params});
	},
	
	/**
	 * override
	 */
	afterGridUpdated : function(grid, updateType, response) {
		this.reload(grid, {
			'_q[domain_id-eq]' : login.current_domain_id,
			'_q[menu_type-eq]' : 'MENU',
			'_o[rank]' : 'asc'
		});
	},
	
	/**
	 * main menu click 시 
	 */
	onMenuClick : function(grid, record, item, index, e, eOpts) {
		this.selectedRecord = record;
		if(this.selectedRecord.get('id')) {
			var subMenuGrid = this.getSubGridView();
			var text = subMenuGrid.child('textfield');
			text.setValue(T('title.' + this.singleEntityName) + ' : ' + record.get('name'));
			this.reload(subMenuGrid, {
				'_q[domain_id-eq]' : login.current_domain_id,
				'_q[parent_id-eq]' : record.get('id'),
				'_q[menu_type-noteq]' : 'MENU',
				'_o[rank]' : 'asc'
			});
		}
	},
	
	/**
	 * 그리드에서 선택된 데이터를 삭제 
	 *
	 * @grid
	 */
	deleteMenuGridRows : function(grid) {
		if(this.selectedRecord) {
			this.deleteGridData(grid, this.subGridMultiUpdateUrl);
		}
	},
	
	/**
	 * 추가, 삭제, 변경을 한 grid의 데이터를 저장 
	 *
	 * @grid
	 */
	saveMenuGridRows : function(grid) {
		if(this.selectedRecord) {
			this.saveGridData(grid, this.subGridMultiUpdateUrl);
		}
	},
	
	/**
	 * 메뉴 그리드 업데이트 후 콜백 
	 *
	 * @grid
	 * @updateType
	 * @response
	 */
	afterMenuGridUpdated : function(grid, updateType, response) {
		this.reload(grid, {
			'_q[domain_id-eq]' : login.current_domain_id,
			'_q[parent_id-eq]' : this.selectedRecord.get('id'),
			'_q[menu_type-noteq]' : 'MENU',
			'_o[rank]' : 'asc'
		});
	},

	/****************************************************************
	 ** 			여기서 부터는 abstract method, 필수 구현 				   **
	 ****************************************************************/
	/**
	 * main view를 리턴 
	 */
	getMainView : function() {
		return this.getMenu();
	},
	
	/**
	 * sub menu list view를 리턴 
	 */
	getSubGridView : function() {
		return this.queryItem(null, 'base_submenu_list');
	},
	
	/**
	 * 모델 생성 ...
	 *
	 * @data
	 */
	newModel : function(grid, data) {
		if(grid.xtype == 'base_menu_list') {
			data = data || { domain_id : login.current_domain_id, menu_type : 'MENU' };
			return Ext.create(this.models[0], data);
		} else if(grid.xtype == 'base_submenu_list') {
			return Ext.create('Base.model.Menu', {
				domain_id : login.current_domain_id,
				id : '',
				name : '',
				description : '',
				parent_id : this.selectedRecord.get('id'),
				entity_id : '',
				template : '',
				menu_type : 'SCREEN',
				category : '',
				rank : 1});
		}
	}
});
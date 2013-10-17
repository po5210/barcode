/**
 * ReportMain controller
 */
Ext.define('Base.abstract.entity.ReportMainController', {
	
	extend : 'Base.abstract.entity.CoreController',
	
	/**
	 * initialize
	 */
	init : function() {
		this.parseClassName();
	},
	
	/**
	 * class name을 파싱하여 각종 name을 설정한다. 
	 */
	parseClassName : function() {
		var className = Ext.getClassName(this);
		var classNameArr = className.split('.');
		this.bundleName = classNameArr[0].toLowerCase();
		this.singleEntityName = classNameArr[2];
		this.multipleEntityName = this.getMultipleEntityName(this.singleEntityName);
		// list main view xtype : bundle_entity (ex) base_role
		this.mainViewName = this.bundleName + '_' + this.singleEntityName;
		// grid view xtype : bundle_entity_list (ex) base_role_list
		this.gridViewName = this.bundleName + '_' + this.singleEntityName + '_list';
		// search view xtype : bundle_entity_search (ex) base_role_search
		this.searchViewName = this.bundleName + '_' + this.singleEntityName + '_search';
	},
	
	/**
	 * entity 복수형을 리턴 
	 */
	getMultipleEntityName : function(singleEntityName) {
		return singleEntityName + 's';
	},
	
	/**
	 * grid view를 리턴 
	 */
	getGridView : function() {
		return this.queryItem(null, this.gridViewName);
	},
	
	/**
	 * search view를 리턴 
	 */
	getSearchView : function() {
		// TODO 검색창에 대한 화면 배치를 효율적으로 정리할 것.
		return Ext.getCmp('viewport').down(this.searchViewName);
	},
	
	/**
	 * search form을 리턴 
	 */
	getSearchForm : function() {
		return this.getSearchView().getForm();
	},
	
	/**
	 * main store를 리턴 
	 */
	getMainStore : function() {	
		return this.getStore(this.stores[0]);
	},
	
	/**
	 * search form을 reset
	 */
	onResetClick : function(btn) {
		var searchForm = this.getSearchForm();
		searchForm.reset();
	},
	
	/**
	 * search 버튼을 클릭했을 경우 검색 수행 
	 *
	 * @return
	 */
	onSearchClick : function(btn) {
		var searchForm = this.getSearchForm();
		var params = searchForm.getValues();
		this.getMainView().setParams(params);
	},
	
	/**
	 * detail view name을 리턴 
	 */
	getDetailViewName : function() {
		return this.views[0] + 'Detail';
	},
	
	/**
	 * show detail button을 클릭시  
	 *
	 * @gridView
	 */
	onShowDetail : function(gridView, td, rowIndex, colIndex, event, record, tr, grid) {
		if(this.getDetailViewType && this.getDetailViewName) {
			var detailType = this.getDetailViewType();
			if(detailType == 'popup') {
				HF.popup(this.getDetailViewName(), {id : record.get('id')}, {});
			} else if(detailType == 'view') {
				HF.show(this.getDetailViewName(), {id : record.get('id')})
			}
		}
	},
	
	/**
	 * entry point
	 *
	 * @return
	 */	
	onParamsChange: function(view, params) {
		params = this.beforeParamsChange(view, params);
		if(this.validateParams(view, params)) {
			var searchForm = this.getSearchForm();
			searchForm.setValues(params);
			var grid = view.down('grid');
			var store = grid.getStore();
			store.getProxy().extraParams = searchForm.getValues();
			store.load({
				page : 1,
				callback : function(records, operation, success) {
					if(success) {
						grid.fireEvent('after_grid_loaded', records, operation);
					}
				}
			});
		}
	},
	
	/**
	 * onParamsChange전에 처리, 기본으로 들어가야 할 파라미터 등을 세팅한다.
	 */
	beforeParamsChange : function(view, params) {
		return params;
	},
	
	/**
	 * onParamsChange전에 처리, 파라미터 validation 체크 
	 */
	validateParams : function(view, params) {
		return true;
	},
	
	/**
	 * import button click시 
	 */
	onImport : function() {
		HF.popup('Base.view.field.ImportPopup', null, {
			owner : this.getMainView(), 
			url : 'domains/' + login.current_domain_id + '/' + this.multipleEntityName + '/import.json'
		});
	},

	onExport : function() {
		var searchFormView = this.getSearchView();
		var params = searchFormView.getForm().getValues();
		var paramStr = Ext.Object.toQueryString(params);
		window.location.href = this.getExportUrl() + '?' + paramStr;
	},
	
	getExportUrl : function() {
		return 'domains/' + login.current_domain_id + '/' + this.multipleEntityName + '/export.xls';
	}
});
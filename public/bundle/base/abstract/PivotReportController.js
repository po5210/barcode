/**
 * PivotGridPanel controller
 */
Ext.define('Base.abstract.PivotReportController', {
	
	extend : 'Base.abstract.PanelController',
	
	/**
	 * search form을 reset
	 */
	onResetClick : function(searchview) {
		var searchForm = searchview.getForm();
		searchForm.reset();
	},
	
	/**
	 * search 버튼을 클릭했을 경우 검색 수행 
	 *
	 * @return
	 */
	onSearchClick : function(searchview) {
		var searchForm = searchview.getForm();
		var params = searchForm.getValues();
		searchview.up().setParams(params);
	},
	
	/**
	 * entry point
	 *
	 * @return
	 */	
	onParamsChange: function(view, params) {
		params = this.beforeParamsChange(view, params);
		if(this.validateParams(view, params)) {
			var searchForm = view.down(view.searchView).getForm();
			searchForm.setValues(params);
			this.reload(view, searchForm.getValues());
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
	 * grid reload by params
	 *
	 * @grid
	 * @params
	 * @return
	 */
	reload : function(view, params) {
		/*
		MzPivotGrid 의 문제로인해, 매번 그리드와 스토어를 새로 만들어야 하기 때문에, 여기서 그 작업을 해준다.
		*/
		view.removeAll();
		
		var store = Ext.create(view.store);
		var grid = view.grid;
		grid.store = store;
		
		view.add(grid);

		params = params || {};
		
		// ******* Report, PivotReport는 파라미터를 그냥 가공없이 넘긴다. ***********
		//params = this.buildGridParams(grid, params);

		store.proxy.extraParams = params;

		store.load();
	},

	/***** TODO Pivot Report의 표준적인 파라미터 설정 방법을 아래에서 제공한다. 일단 표준 파라미터 방법을 그대로 사용함. *****/
	/**
	 * grid의 조회를 위한 search, select, sort 파라미터 정보를 생성한다.
	 *
	 * @grid
	 * @params
	 * @return
	 */
	buildGridParams : function(grid, params) {
		params = params || {};
		
		var searchParams = this.buildSearchParams(grid, params);
		var selectParams = this.buildSelectParams(grid, params);
		var sortParams = this.buildSortParams(grid, params);		
		
		searchParams['_s'] = "[" + selectParams.join(",") + "]";
		
		Ext.Array.each(sortParams, function(sortColumn) { searchParams['_o[' + sortColumn.name + ']'] = sortColumn.direction; });
		
		return searchParams;
	},

	/**
	 * grid의 조회를 위한 search 파라미터 정보를 생성한다.
	 *
	 * @grid
	 * @params
	 * @return
	 */
	buildSearchParams : function(grid, params) {
		var searchParams = {};
		Ext.Object.each(this.getDefaultFilters(), function(key, value) {
			params[key] = value;
		});		
		// TODO search parameter 이름이 변경되면 여기서 변경 --> 설정사항으로 ...
		Ext.Object.each(params, function(key, value) {
			searchParams['_q[' + key + ']'] = value;
		});
		return searchParams;
	},

	/**
	 * grid의 조회를 위한 select 파라미터 정보를 생성한다.
	 *
	 * @grid
	 * @params
	 * @return
	 */
	buildSelectParams : function(grid, params) {
		var selectParams = [];
		// 그리드의 헤더 정보를 얻어와 select fields 파라미터를 만든다. select field 파라미터는 결정 필요
		Ext.Array.each(grid.columns, function(column) {
			if(column.dataIndex && column.dataIndex != '_cud_flag_') {
				selectParams.push(column.dataIndex);
			}
		});
		return selectParams;
	},

	/**
	 * grid의 조회를 위한 sort 파라미터 정보를 생성한다.
	 *
	 * @grid
	 * @params
	 * @return
	 */
	buildSortParams : function(grid, params) {
		var sortParams = [];
		Ext.Array.each(grid.columns, function(column) {
			if(column.sortOption) {
				var sortName = (column.xtype == 'entitycolumn') ? column.dataIndex + "_id" : column.dataIndex;
				sortParams.push({name : sortName, seq : column.sortOption.sortSeq, direction : column.sortOption.sortDirection});
			}
		});
		return Ext.Array.sort(sortParams, function(colA, colB) { 
			return (colA.seq > colB.seq) ? 1 : ((colA.v < colB.seq) ? -1 : 0);  
		});
	},

	/**
	 * default filter를 리턴 
	 */
	getDefaultFilters : function() {
		return { 'domain_id-eq' : login.current_domain_id };
	}
});
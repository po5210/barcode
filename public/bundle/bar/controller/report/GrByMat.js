/**
 * GrByMat controller
 */
Ext.define('Bar.controller.report.GrByMat', {

	extend: 'Base.abstract.entity.ReportMainController',

	requires : ['Bar.view.report.GrByMat'],

	models : [],

	stores : ['Bar.store.GrByMat'],

	views : ['Bar.view.report.GrByMat'],

	refs: [ 
		{ ref : 'GrByMat', selector : 'bar_gr_by_mat' }
	],

	init: function() {
		this.callParent(arguments);

		this.control({
			'bar_gr_by_mat' : {
				paramschange : this.onParamsChange
			},
			'bar_gr_by_mat_list' : {
				click_export : this.onExport
			},
			'bar_gr_by_mat_search' : {
				click_search : this.onSearchClick,
				click_reset : this.onResetClick
			}
		});
	},

	/****************************************************************
	 ** 					여기는 customizing area 				   **
	 ****************************************************************/

	beforeParamsChange : function(view, params) {
		// 검색은 오늘 날짜까지만 가능
		var searchView = this.getSearchView();
		searchView.down('datefield[name=in_dt-gte]').setMaxValue(HF.getCurrentShiftDate());

		if(!params) {
			params = {};
		}
		if(!params['in_dt-gte']) {
			params['in_dt-gte'] = HF.getCurrentShiftDate();
		}
		if(!params['in_dt-lte']) {
			params['in_dt-lte'] = HF.getCurrentShiftDate();
		}
		return params;
	},

	/**
	 * 실적 수정 팝업 close 버튼 클릭시 
	 */
	onClickClose : function(view) {
		view.close();
	},

	/****************************************************************
	 ** 			여기서 부터는 abstract method, 필수 구현 					**
	 ****************************************************************/
	parseClassName : function() {
		this.mainViewName = 'bar_gr_by_mat';
		this.gridViewName = 'bar_gr_by_mat_list';
		this.searchViewName = 'bar_gr_by_mat_search';
	},
	
	/**
	 * main view를 리턴 
	 */
	getMainView : function() {
		return this.getGrByMat();
	}
});
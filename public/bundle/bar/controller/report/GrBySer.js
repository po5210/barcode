/**
 * GrBySer controller
 */
Ext.define('Bar.controller.report.GrBySer', {

	extend: 'Base.abstract.entity.ReportMainController',

	requires : ['Bar.view.report.GrBySer'],

	models : [],

	stores: ['Bar.store.GrBySer'],

	views : ['Bar.view.report.GrBySer'],

	refs: [ 
		{ ref : 'GrBySer', selector : 'bar_gr_by_ser' }
	],

	init: function() {
		this.callParent(arguments);

		this.control({
			'bar_gr_by_ser' : {
				paramschange : this.onParamsChange
			},
			'bar_gr_by_ser_list' : {
				click_export : this.onExport
			},
			'bar_gr_by_ser_search' : {
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
		searchView.down('datefield[name=wh_dt-gte]').setMaxValue(HF.getCurrentShiftDate());

		if(!params) {
			params = {};
		}
		if(!params['wh_dt-gte']) {
			params['wh_dt-gte'] = HF.getCurrentShiftDate();
		}
		if(!params['wh_dt-lte']) {
			params['wh_dt-lte'] = HF.getCurrentShiftDate();
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
		this.mainViewName = 'bar_gr_by_ser';
		this.gridViewName = 'bar_gr_by_ser_list';
		this.searchViewName = 'bar_gr_by_ser_search';
	},
	
	/**
	 * main view를 리턴 
	 */
	getMainView : function() {
		return this.getGrBySer();
	}
});
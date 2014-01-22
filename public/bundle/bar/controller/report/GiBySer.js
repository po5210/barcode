/**
 * GiBySer controller
 */
Ext.define('Bar.controller.report.GiBySer', {

	extend: 'Base.abstract.entity.ReportMainController',

	requires : ['Bar.view.report.GiBySer'],

	models : [],

	stores: ['Bar.store.GiBySer'],

	views : ['Bar.view.report.GiBySer'],

	refs: [ 
		{ ref : 'GiBySer', selector : 'bar_gi_by_ser' }
	],

	init: function() {
		this.callParent(arguments);

		this.control({
			'bar_gi_by_ser' : {
				paramschange : this.onParamsChange
			},
			'bar_gi_by_ser_list' : {
				click_export : this.onExport
			},
			'bar_gi_by_ser_search' : {
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
		searchView.down('datefield[name=date-gte]').setMaxValue(HF.getCurrentShiftDate());

		if(!params) {
			params = {};
		}
		if(!params['date-gte']) {
			params['date-gte'] = HF.getCurrentShiftDate();
		}
		if(!params['date-lte']) {
			params['date-lte'] = HF.getCurrentShiftDate();
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
		this.mainViewName = 'bar_gi_by_ser';
		this.gridViewName = 'bar_gi_by_ser_list';
		this.searchViewName = 'bar_gi_by_ser_search';
	},
	
	/**
	 * main view를 리턴 
	 */
	getMainView : function() {
		return this.getGiBySer();
	}
});
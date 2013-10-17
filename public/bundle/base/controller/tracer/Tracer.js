Ext.define('Base.controller.tracer.Tracer', {
	extend : 'Base.abstract.PanelController',
	
	views : ['Base.view.tracer.Tracer'],
	
	refs : [ {
		selector : 'base_tracer #detailview',
		ref : 'detailView'
	}, {
		selector : 'base_tracer tabpanel',
		ref : 'detailContent'
	} ],
	
	init : function() {
		this.control({
			'base_tracer' : {
				show : this.onShow,
				click_close : this.onClickClose,
				click_delete : this.onClickDelete,
				click_report : this.onClickReport
			},
			'base_tracer grid' : {
				select : this.onTraceItemSelected
			}
		});
	},
	
	onShow : function(view) {
		var grid = view.down('grid');
		var smodel = grid.getSelectionModel();
		if(grid.getStore().first() && smodel.getSelection().length == 0)
			grid.getSelectionModel().select(0);
	},
	
	updateDetail : function(data) {
		this.getDetailView().update(data);
		this.getDetailContent().items.each(function(view) {
			view.update(data)
		});
	},
	
	onTraceItemSelected : function(row, record) {
		this.updateDetail(record.data);
	},
	
	onClickDelete : function(view) {
		var grid = view.down('grid');
		
		var rows = grid.selModel.getSelection();
		for(var i=0; i< rows.length; i++) {
			grid.getStore().remove(rows[i]);
		}
		this.updateDetail(undefined);
	},
	
	onClickReport : function() {
		// TODO Implement.
	}
});

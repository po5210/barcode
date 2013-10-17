Ext.define('Ops.controller.docs.SheetMain', {
	
	extend : 'Base.abstract.PanelController',
	
	views : ['Ops.view.docs.SheetMain'],
	
	models : ['Base.model.FileGroupWithAttachments'],
	
	stores : ['Prod.store.StdWorkDoc'],
	
	init : function() {
		this.control({
			'ops_docs_main' : {
				paramschange : this.onParamsChange
			},
			'ops_docs_main #docs_report' : {
				click : this.onDocsView
			}
		});
	},
	
	onParamsChange : function(view, params) {
		if(!HF.setting.get('option-operation')) {
			var field = Ext.getCmp('optionbar').down('field[name=option-operation]');
			HF.msg.tip(T('text.Select Operation First'), field);
			return;
		}
		
		var grid = view.child('grid');
		var store = grid.getStore();
		
		store.getProxy().extraParams = {
			'_q[operation_id-eq]' : HF.setting.get('option-operation').id
		};
		store.load();
	},
	
	onDocsView : function(grid, item, rowIndex, colIndex, e, record) {
		Ext.ModelManager.getModel('Base.model.FileGroupWithAttachments').load(record.get('file_group_id'), {
		    success: function(file_group) {
				HF.slideshow(file_group.data.attachments);
		    }
		});
	}
});
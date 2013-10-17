Ext.define('Base.controller.common.CodePicker', {
	extend : 'Ext.app.Controller',
	
	views : ['Base.view.common.CodePicker'],
	
	init : function() {
		this.control({
			'codepicker' : {
				show : this.onShow
			},
			'codepicker grid' : {
				itemclick : this.onItemClick
			},
			'codepicker textfield' : {
				change : this.onSearchChange,
				specialkey : this.onSpecialKey
			}
		});
	},
	
	onShow : function(picker) {
		var grid = picker.down('grid');

		var store = Ext.create('Base.store.Code');
		store.getProxy().setExtraParam('name', picker.host.commonCode);

		grid.reconfigure(store);

		store.load({
			scope : this,
			callback : function(records, operation, success) {
				picker.down('#search textfield[name=name]').setValue(picker.host.getValue());
			}
		});
	},
	
	onSearchChange : function(field, val) {
		var picker = field.up('codepicker');
		var grid = picker.down('grid');

		var conds = [];
		var selModel = grid.getSelectionModel();
		
		picker.down('#search').items.each(function(field) {
			var value = field.getValue();

			if (value) {
				conds.push({
					column : field.getName(),
					value : value.toUpperCase()
				});
			}
		});

		var idx = -1;
		if(conds.length > 0) {
			idx = grid.getStore().findBy(function(record, id) {
				var match = true;
				Ext.Array.each(conds, function(cond) {
					if(record.get(cond.column).toUpperCase().indexOf(cond.value) === -1) {
						match = false;
						return false;
					}
				});
				return match;
			});
		}
		
		if (idx > -1)
			selModel.select(idx);
		else
			selModel.deselectAll();

		field.focus();
	},
	
	onItemClick : function(grid, record) {
		var picker = grid.up('codepicker');
		picker.host.selectItem(picker, record);
	},
	
	onSpecialKey : function(field, e) {
		switch(e.getKey()) {
			case e.UP :
			case e.DOWN :
				var picker = field.up('codepicker');
				var grid = picker.down('grid');

				/* 포커스를 그리드로 옮기고, (TODO) 이벤트를 전달한다. */
				grid.getView().focus();

				/* 선택된 것이 없으면, 맨 처음 아이템을 선택한다. */
				var selModel = grid.getSelectionModel();
				
				var record = selModel.getSelection()[0];

				if(!record)
					selModel.select(0);

				e.stopEvent();
				
				return;
			case e.ENTER :
				var picker = field.up('codepicker');
				var grid = picker.down('grid');
				
				var record = grid.getSelectionModel().getSelection()[0];
				
				if(record) {
					picker.host.selectItem(picker, record);
				}
				
				return;
			case e.ESC :
				var picker = field.up('codepicker');
		        picker.host.cancelSelect();
			default :
		}
	}
});
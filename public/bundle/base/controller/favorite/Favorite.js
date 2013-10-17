Ext.define('Base.controller.favorite.Favorite', {
	extend : 'Base.abstract.PanelController',
	
	views : ['Base.view.favorite.Favorite'],
	
	refs: [ {
		ref : 'favoriteGrid',
		selector : 'base_favorite grid[itemId=grid_favorite]'
	}, {
		ref : 'menuGrid',
		selector : 'base_favorite grid[itemId=grid_menu]'
	} ],
	
	init: function() {
		this.callParent(arguments);

		this.control({
			'base_favorite' : {
				click_close : this.onClickClose
			},
			'base_favorite button[itemId=delete]' : {
				click : this.onClickDelete
			},
			'base_favorite button[itemId=add]' : {
				click : this.onClickAdd
			},
			'base_favorite button[itemId=moveup]' : {
				click : this.onClickMoveUp
			},
			'base_favorite button[itemId=movedown]' : {
				click : this.onClickMoveDown
			}
		});
	},
	
	onClickDelete : function() {
		var grid = this.getFavoriteGrid();
		
		var selections = grid.getSelectionModel().getSelection();
		if(selections.length > 0) {
			Ext.Array.each(selections, function(selection) {
				if(selection.data.id && selection.store) {
					selection.store.remove(selection);
				}
			});
		} else {
			HF.msg.notice(T('text.Nothing selected'));
		}
	},
	
	moveSelectedRow : function(grid, direction, record) {
		if (!record) {
			return;
		}
		var index = grid.getStore().indexOf(record);
		if (direction < 0) {
			index--;
			if (index < 0) {
				return;
			}
		} else {
			index++;
			if (index >= grid.getStore().getCount()) {
				return;
			}
		}

		grid.getStore().remove(record);
		var tobeadded = Ext.clone(record.getData());
		
		delete tobeadded.id;
		var added = grid.getStore().insert(index, tobeadded);
		
		grid.getSelectionModel().select(added);
	},
	
	onClickMoveUp : function() {
		var grid = this.getFavoriteGrid();
		
		var selections = grid.getSelectionModel().getSelection();
		
		if(selections.length === 1) {
			this.moveSelectedRow(grid, -1, selections[0]);
			grid.store.sync();
		} else {
			HF.msg.notice(T('text.Select one and only one record'));
		}
	},
	
	onClickMoveDown : function() {
		var grid = this.getFavoriteGrid();
		
		var selections = grid.getSelectionModel().getSelection();
		
		if(selections.length === 1) {
			this.moveSelectedRow(grid, 1, selections[0]);
			grid.store.sync();
		} else {
			HF.msg.notice(T('text.Select one and only one record'));
		}
	},
	
	onClickAdd : function() {
		var fgrid = this.getFavoriteGrid();
		var mgrid = this.getMenuGrid();
		var fstore = fgrid.store;
		
		var selections = mgrid.getSelectionModel().getSelection();
		if(selections.length > 0) {
			Ext.Array.each(selections, function(selection) {
				if(fstore.find('name', selection.get('name')) === -1) {
					var fav = {
						name : selection.get('name'),
						description : selection.get('description'),
						domain_id : selection.get('domain_id'),
						template : selection.get('template'),
						alias : T('menu.' + selection.get('name'))
					};
					fstore.add(fav);
				}
			});
		} else {
			HF.msg.notice(T('text.Nothing selected'));
		}
	}

});

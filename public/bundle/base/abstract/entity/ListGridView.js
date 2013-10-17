Ext.define('Base.abstract.entity.ListGridView', {
	
	extend : 'Ext.grid.Panel',
	
	xtype : 'base_entity_list_grid',
	
	requires : ['Ext.ux.CheckColumn'],
		
	verticalScroller : { variableRowHeight: true },
	
	selType : 'cellmodel', 
	
	useDetailBtn : true,
	
	selectionMode : 'MULTI',
	
	bbar : {
		xtype : 'pagingtoolbar',
		cls : 'pagingToolbar',
        displayInfo: true,
        displayMsg: T('text.Paging Toolbar Display Message'),
        emptyMsg: T('text.Paging Toolbar Empty Message'),
		hidden : true
	},
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'import', 'export', 'add', 'save', 'delete']
	} ],
		
	initComponent : function() {
		/**
		 *	피상속 클래스의 플러그인 객체와 셀모델 객체는 공유되어서는 안된다.
		 */
		this.plugins = [ Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1
		}) ];
		
		this.selModel = Ext.create('Ext.selection.CheckboxModel', { pruneRemoved : false, mode: this.selectionMode });
		
		this.callParent(arguments);
		
		if(this.useDetailBtn) {
			this.on('afterrender', function(grid, eOpts) {
				var column = Ext.create('Ext.grid.column.Action', {
					xtype : 'actioncolumn', 
					width : 30, 
					align : 'center', 
					itemId : 'go_detail',
					items : [ { icon : 'theme/image/iconDetail.png', tooltip : T('title.details') } ] 
				});
				grid.headerCt.insert(1, column);
			});
		}
		
		var pagingtoolbar = this.down('pagingtoolbar');
		
		pagingtoolbar.bindStore(this.getStore());
		
		this.getStore().on('load', function(store) {
			if(store.getTotalCount() > store.getCount()) {
				pagingtoolbar.show();
			} else {
				pagingtoolbar.hide();
			}
		});
		
		/*this.on('edit', function(editor, e) {
			if(e.column.xtype === 'entitycolumn') {
				console.log(e.originalValue, e.value);
				if(e.originalValue && e.value && e.originalValue.id === e.value.id) {
					e.value = e.originalValue;
				}
			}
		});*/
		
		/**
		 * Grid Total Count를 타이틀에 표시
		 * TODO : 다른 곳에 표시하도록 변경 
		 */
		/*this.store.on('load', function(store) {
			var view = Ext.getCmp('content').getLayout().getActiveItem();
			Ext.getCmp('title').setText(view.title + ' (count : ' + store.getTotalCount() + ')');
		});*/
	}
});
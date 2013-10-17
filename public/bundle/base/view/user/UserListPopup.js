Ext.define('Base.view.user.UserListPopup', {

	extend: 'Base.abstract.Popup',

	xtype: 'base_user_list_popup',

	title: T('title.user'),
	
	height : 600,
	
	userStore : Ext.create('Base.store.User'),
	
	initComponent : function() {
		this.items = [ this.createView(this) ];
		this.callParent();
		
		var pagingtoolbar = this.down(' pagingtoolbar');
		pagingtoolbar.bindStore(this.userStore);
		
		this.userStore.on('load', function(store) {
			if(store.getTotalCount() > store.getCount()) {
				pagingtoolbar.show();
			} else {
				pagingtoolbar.hide();
			}
		});
	},
	
	createView : function(view) {
		return {
			xtype : 'container',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : [ this.createFormPart(this), this.createGridPart(this) ]
		};
	},
	
	createFormPart: function(view) {
		return {
			xtype: 'form',
			layout: {
				type : 'vbox',
				align : 'stretch',
				bodyPadding: '5 5 5 5',
			},
			items : [ {
				xtype: 'container',
				layout : {
					type : 'hbox',
					align : 'stretch',
					anchor : '90%'
				},
			    items: [ {
					name : 'login-like',
					fieldLabel : T('label.login'),
					xtype : 'textfield',
					flex : 1,
					margin : '5 5 5 5',
				}, {
					name : 'name-like',
					fieldLabel : T('label.name'),
					xtype : 'textfield',
					flex : 1,
					margin : '5 5 5 5',
				} ]
			}, {
				xtype: 'container',
				layout : {
					type : 'hbox',
					align : 'stretch',
					anchor : '90%'
				},
			    items: [ { 
					fieldLabel : T('label.department'), 
					name : 'dept-eq', 
					xtype : 'codecombo', 
					commonCode : 'PROD_DEPT', 
					valueField : 'name', 
					displayField : 'description',
					flex : 1,
					margin : '5 5 5 5',
				}, {
					name : 'admin_flag-eq',
					fieldLabel : T('label.admin'),
					xtype : 'checkbox',
					inputValue : true,
					flex : 1,
					margin : '5 5 5 5',
				} ]
			} ]			
		}
	},
	
	createGridPart : function(self) {
		return {
			xtype : 'grid',
			
			flex : 1,

			store : self.userStore,

			verticalScroller : { variableRowHeight: true },

			selModel : Ext.create('Ext.selection.CheckboxModel'),

			columns : [ { 
				dataIndex : 'id',
				text : T('label.id'),
				hidden : true
			}, {
				dataIndex : 'login',
				text : T('label.login'),
				width : 100
			}, {
				dataIndex : 'name',
				text : T('label.user_name'),
				width : 250
			}, {
				dataIndex : 'dept',
				text : T('label.dept'),
				xtype : 'codecolumn',
				tpl : '{description}', 
				commonCode : 'PROD_DEPT',
				width : 150
			}, {
				xtype : 'checkcolumn',
				dataIndex : 'admin_flag',
				text : T('label.admin')
			}, {
				xtype : 'checkcolumn',
				dataIndex : 'operator_flag',
				text : T('label.operator_flag')
			} ],

			bbar : {
				xtype : 'pagingtoolbar',
				cls : 'pagingToolbar',
				store : this.userStore,
		        displayInfo: true,
		        displayMsg: T('text.Paging Toolbar Display Message'),
		        emptyMsg: T('text.Paging Toolbar Empty Message'),
				hidden : false
			}
		};
	},
	
	dockedItems: [ {
		xtype: 'controlbar',
		items: ['->', 'search', 'select', 'close']
	} ]
});

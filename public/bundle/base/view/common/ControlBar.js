Ext.define('Base.view.common.ControlBar', {
	extend : 'Ext.toolbar.Toolbar',
	
	xtype : 'controlbar',

	dock : 'bottom',

	items : [ '->', 'close' ],

	initComponent : function() {
		var self = this;
		this.on('afterrender', this.afterrenderExe);
		this.items = Ext.Array.map(this.items, function(b) {
			if (typeof(b) === 'string' && b !== '-' && b !== '->' && b !== ' ') {
				if(b == 'delete') {
					return {
						text : T('button.' + b),
						itemId : Ext.String.uncapitalize(b),
						minWidth : 75,
						auth : 'D',
						cls : 'btnDelete'
					};
				} else {
					var auth = self.getButtonAuth(b);
					return {
						text : T('button.' + b),
						itemId : Ext.String.uncapitalize(b),
						minWidth : 75,
						auth : auth
					};
				}
			} 
			return b;
		});

		this.callParent();
	},
	
	getButtonAuth : function(buttonName) {
		if(!buttonName) {
			return '';
			
		} else if(buttonName == 'add' || buttonName == 'new' || buttonName == 'create' || buttonName == 'import') {
			return 'C';
			
		} else if(buttonName == 'update' || buttonName == 'save') {
			return 'U';
			
		} else if(buttonName == 'delete') {
			return 'D';
			
		} else if(buttonName == 'inquiry' || buttonName == 'show' || buttonName == 'export') {
			return 'R';
			
		} else {
			return '';
		}
	},

	getOwner : function() {
		return this.up();
	},
	
	afterrenderExe: function(obj, eOpts) {
		this.getMenuAuth(this);
		
		if(this.beforeUpObj) {
			this.authApply();
		}
	},
	
	authApply: function() {
		var me = this;
		var menuDatas = Ext.getStore("Menu").data.items;
		
		if(menuDatas.length == 0) {
			var task = new Ext.util.DelayedTask(function() {
			    me.authApply();
			});
			task.delay(500);
			
		} else {
			if(menuDatas[0].data) {
				for(var i = 0 ; i < menuDatas.length; i++) {
					if(this.beforeUpObj.itemId == menuDatas[i].data.template) {
						if(menuDatas[i].data.auth) {
							var authDatas = menuDatas[i].data.auth.split(",");
							
							// 'C' (create) 권한이 없으면 auth 정보가 'C'인 버튼을 찾아서 숨긴다.
							if(authDatas.indexOf('C') == -1) {
								var createAuthButtons = me.query('button[auth=C]');
								me.hideButtons(createAuthButtons);
							} 
							
							// 'U' (update) 권한이 없으면 auth 정보가 'U'인 버튼을 찾아서 숨긴다.
							if(authDatas.indexOf('U') == -1) {
								var updateAuthButtons = me.query('button[auth=U]');
								me.hideButtons(updateAuthButtons);
							} 
							
							// 'D' (delete) 권한이 없으면 auth 정보가 'D'인 버튼을 찾아서 숨긴다.
							if(authDatas.indexOf('D') == -1) {
								var deleteAuthButtons = me.query('button[auth=D]');
								me.hideButtons(deleteAuthButtons);
							}
						}
					}
				}
			} else {
				var task = new Ext.util.DelayedTask(function(){
				    me.authApply();
				});
				task.delay(500);
			}
		}
	},
	
	hideButtons : function(buttons) {
		Ext.Array.each(buttons, function(button) {
			button.hide();
		});
	},
	
	beforeUpObj: null,
	
	getMenuAuth: function(tarView) {
		try {
			if(!tarView) {
				return;
			}
			var upObj = tarView.up();
			if(upObj && upObj.id && upObj.id == 'content') {
				return;
			} else {
				this.beforeUpObj = upObj;
				this.getMenuAuth(upObj);
			}
		} catch(e) {
			return;
		}
	}
});
Ext.define('Base.controller.BaseController', {
	extend: 'Ext.app.Controller',

	requires: ['Base.mixin.Status', 'Base.mixin.Tracer', 'Base.controller.common.ControlBar'],

	stores: ['Base.store.Tracer'],
	models: ['Base.model.Tracer'],

	views: ['Base.view.common.ControlBar', 'Base.view.common.Downloader',
	'Base.view.grid.CodeColumn', 'Base.view.grid.EntityColumn', 'Base.view.grid.TextLinkColumn', 'Base.view.user.UserLinkColumn', 
	'Base.view.field.EntityField', 'Base.view.field.EntityNameField', 'Base.view.field.EntityCombo', 'Base.view.field.EntityNameCombo',
	'Base.view.field.EntitySearchCombo',
	'Base.view.field.CodeField', 'Base.view.field.CodeCombo', 'Base.view.field.DateRange', 'Base.view.field.DateTimeRange',
	'Base.view.field.ImportPopup',
	'Ext.ux.form.DateTimeField'],

	controllers: ['common.ControlBar', 'common.CodePicker', 'common.EntityPicker', 'user.UserPopup'],

	init: function() {
		var self = this;

		Ext.each(this.controllers, function(ctl) {
			self.getController('Base.controller.' + ctl);
		});

		this.control({
			'#user_profile' : {
				click : this.onUserProfile
			},
			'#user_language' : {
				added : this.onUserLanguageMenuAdded
			},
			'base_popup' : {
				show : this.onPopupShow
			},
			'base_entity_list_search field' : {
				specialkey : this.onSpecialKeySearchField
			}
		});

		HF.mixin('Base.mixin.Status');
		HF.mixin('Base.mixin.Tracer');
		HF.mixin('Base.mixin.Code');

		HF.custom.topbar({
			xtype : 'button',
			text : T('button.setting'),
			cls : 'sideSetting',
			handler : function() {
				HF.show('Base.view.setting.Setting');
			}
		});

		HF.custom.topbar({
			xtype : 'button',
			text : T('button.language'),
			id : 'user_language',
			menu : []
		});

		var dept = login.dept ? HF.code('PROD_DEPT', login.dept) : null;
		HF.custom.topbar({
			xtype : 'button',
			id : 'user_profile',
			text : login.name + (dept ? ' (' + dept.description + ')' : '')
		});

		HF.custom.statusbar({
			xtype: 'button',
			cls : 'btnTracer',
			handler: function() {
				HF.show('Base.view.tracer.Tracer');
			}
		});
		
		HF.custom.setting({
			xtype : 'container',
			layout : 'hbox',
			items : [ {
				xtype : 'checkbox',
				fieldLabel : T('setting.setting-folding_sidebar'),
				name : 'setting-folding_sidebar'
			} ]
		});
	},
	
	onUserProfile : function() {
		HF.popup('Base.view.user.UserPwChangePopup', {
			id : login.id
		});
	},
	
	onUserLanguageMenuAdded : function(menu) {
		var languages = [{
			text : 'English',
			locale : 'en-US'
		}/*, {
			text : 'Korean',
			locale : 'ko-KR'
		}*/ ];
		
		var menus = [];
		
		Ext.Array.each(languages, function(lang) {
			menus.push({
				xtype : 'menucheckitem',
				text : lang.text,
				group : 'language',
				inputValue : lang.locale,
				checked : (lang.locale === Ext.util.Cookies.get('language')),
				checkHandler : function(item, checked) {
					if(!checked)
						return;
						
					Ext.util.Cookies.set('language', item.inputValue)

					location.reload();
				}
			});
		});
		
		menu.menu.add(menus);
	},
	
	/* closeOnClickMask가 설정된 모든 base_popup은 모달 마스크가 클릭되면, 닫힌다.*/
	onPopupShow : function(win) {
		if(win.closeOnClickMask) {
			var listener = Ext.select('.x-mask').addListener('click', function() {
				Ext.select('.x-mask').removeListener(listener);
	            win.close();
	        });
		}
	},
	
	/* 모든 검색 패널의 필드에서 Enter Key 가 눌리면, 검색을 실행한다. */
	onSpecialKeySearchField : function(field, e) {
		if (e.getKey() !== e.ENTER)
		 	return;

		var searchButton = field.up('base_entity_list_search').down('button#search');
		if(searchButton) {
			/* Field 의 모든 값이 변경된 이후에 실행하는 것을 보장하기 위해서 defer 를 사용한다. */
			Ext.defer(function() {
				searchButton.fireEvent('click', searchButton);
			}, 1);
		}
	}
});

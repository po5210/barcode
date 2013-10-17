Ext.define('Base.controller.common.EntityPicker', {
	extend : 'Ext.app.Controller',
	
	views : ['Base.view.common.EntityPicker'],
	
	init : function() {
		this.control({
			'entitypicker' : {
				show : this.onShow
			},
			'entitypicker grid' : {
				itemclick : this.onItemClick
			},
			'entitypicker form textfield' : {
				change : this.onSearchChange,
				specialkey : this.onSpecialKey
			}
		});
	},
	
	onShow : function(picker) {
		// 처음 열릴 때는 자동 검색하지 않도록 한다.
		picker.changedtime = 0;
		
		var grid = picker.down('grid');
		var store;
		
		if(picker.host.storeClass) {
			var pageSize = picker.host.pageSize ? picker.host.pageSize : 25;
			store = Ext.create(picker.host.storeClass, {
				buffered : false,
				pageSize : pageSize
			});
		} else if(picker.host.customSelectionUrl) {
			var url = picker.host.customSelectionUrl;
			url = url.indexOf(login.current_domain_id + '/') > 0 ?
			url : '/domains/' + login.current_domain_id + '/diy_selections/' + picker.host.customSelectionUrl + '/query.json';
			
			store = Ext.create('Ext.data.Store', {
				fields: ['id', picker.column_1_data_index, picker.column_2_data_index],
				proxy : {
					type : 'ajax',
					url : url,
					format : 'json',
					reader : {
						type : 'json',
						root: 'items',
						successProperty : 'success',
						totalProperty : 'total'
					}
				}
			});
		} else {
			// TODO 구체화 및 다국어 
			HF.msg.failure({msg : 'Bug : Store Class or Custom Selection URL not specified!'});
			return;
		}

		grid.reconfigure(store);

		var pagingtoolbar = grid.down('pagingtoolbar');
		
		pagingtoolbar.bindStore(store);
		
		store.on('load', function(store) {
			if(store.getTotalCount() > store.getCount()) {
				pagingtoolbar.show();
			} else {
				pagingtoolbar.hide();
			}
		});
		
		var associationField = picker.host.associationField;
		if(associationField && Ext.isArray(associationField)) {
			var params = {};
			var container = picker.host.up('form') || picker.host.up('container');
			
			if(container) {
				// var values = container.getValues();
				Ext.Array.each(associationField, function(f) {
					var name = null;
					var value = null;
					
					if(Ext.isString(f)) {
						name = f;
						value = f;
					} else if(Ext.isObject(f) && f.hasOwnProperty('name') && f.hasOwnProperty('value')) {
						name = f.name;
						value = f.value;
					} else {
						return;
					}
					
					if(Ext.isString(value)) {
						var field = container.down('field[name=' + name + ']');
						value = field ? field.getValue() : null;
					} else if(Ext.isFunction(value)) {
						value = value.call(this, picker.host);
					}
					
					params['_q[' + name + ']'] = value;
				});
			}
			Ext.applyIf(store.getProxy().extraParams, params);
		}
		
		store.load({
			scope : this,
			callback : function(records, operation, success) {
				var field = picker.down('form textfield:first');
				field.setValue(picker.host.getRawValue());
				field.focus();
			}
		});
	},
	
	onSearchChange : function(field, val, old) {
		var picker = field.up('entitypicker');
		var grid = picker.down('grid');
		var store = grid.getStore();

		if(!picker.changedtime) {
			picker.changedtime = new Date().getTime();
			return;
		}
		
		picker.changedtime = new Date().getTime();
		
		Ext.defer(function() {
			var defered = new Date().getTime();
			if(defered - picker.changedtime < 1000) {
				return;
			}
			
			var search = field.up('form');
			Ext.Object.merge(store.getProxy().extraParams, search.getValues());
	
			store.load();
		
			field.focus();
		}, 1000);
	},
	
	onItemClick : function(grid, record) {
		var picker = grid.up('entitypicker');
		picker.host.selectItem(picker, record);
	},
	
	onSpecialKey : function(field, e) {
		switch(e.getKey()) {
			case e.UP :
			case e.DOWN :
				var picker = field.up('entitypicker');
				var grid = picker.down('grid');
				var store = grid.getStore();
				var count = store.getCount();

				if(count > 0) {
					var selModel = grid.getSelectionModel();
				
					if(!selModel.hasSelection()) {
						selModel.select(0);
					} else {
						var selected = selModel.getSelection()[0];

						var idx = grid.getView().indexOf(selected) || 0;
						selModel.select((idx + (e.getKey() === e.UP ? -1 : 1) + count) % count);
					}
				}

				field.focus();

				e.stopEvent();
				
				return;
			case e.ENTER :
				var picker = field.up('entitypicker');
				var grid = picker.down('grid');
				var selModel = grid.getSelectionModel();
				
				if(selModel.hasSelection()) {
					picker.host.selectItem(picker, selModel.getSelection()[0]);
				} else {
					var store = grid.getStore();
		
					var search = field.up('form');
					Ext.Object.merge(store.getProxy().extraParams, search.getValues());
		
					store.load();
					
					picker.changedtime = new Date().getTime();
				}
				
				return;
			case e.ESC :
				var picker = field.up('entitypicker');
		        picker.host.cancelSelect();
			default :
		}
	}
});
Ext.define('Base.mixin.Code', {
	constructor : function(config) {

		function code_store(code) {
			var storeName = 'CommonCode.' + code;
			var store = Ext.getStore(storeName);
		
			if(!store) {
				store = Ext.create('Base.store.Code', {
					storeId : storeName
				});

				store.getProxy().setExtraParam('name', code);

			    //---set synchronous loading on this one to avoid problems with rendering
			    Ext.apply(Ext.data.Connection.prototype, {
			        async: false
			    });
				store.load({
					scope: this,
					callback : function(records, operation, success) {
						if(success) {
							// 빈 값을 설정할 수 있도록 첫번째에 빈 값 레코드를 삽입 
							store.insert(0, Ext.create('Base.model.CommonCode', {'id' : '1', 'name' : '', 'description' : this.blankDisplay}));
						}
					},
					async : false
				});

			    //---restore async property to the default value
			    Ext.apply(Ext.data.Connection.prototype, {
			        async: true
			    });
			}
			
			return store;
		}
		
		function code(code, name) {
			var store = code_store(code);
			if(!store) {
				return null;
			}
			var record = store.findRecord('name', name) || {};
			if(record) {
				return record.data;
			} else {
				return null;
			}
		}
		
		return {
			code_store : code_store,
			code : code
		}
	}
});

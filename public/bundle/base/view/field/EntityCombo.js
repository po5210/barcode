Ext.define('Base.view.field.EntityCombo', {
	extend : 'Ext.form.field.ComboBox',
	
	xtype : ['base_entitycombo', 'entitycombo'],

    anchor: '100%',

	/**
	 * 쿼리에 영향을 주는 필드 리스트
	 */
	associationField:[],

	/**
	 * Store 대신 Custom Selection을 사용하는 경우 CustomSelection의 name을 설정
	 */
	customSelectionUrl:'',

	config : {
		valueField : 'id',
		displayField : 'name',

		queryMode : 'remote',
		
	    minChars: 1, 
	    typeAhead: true,
		queryParam : '_q[name-like]',
		pageSize : 25
	},

    listConfig: {
        loadingText: T('text.Searching'),
        emptyText: T('text.No matching data found'),
		
        getInnerTpl: function() {
            return '<span>{name}</span>{description}';
        },
		minWidth : 200
    },
	
	initComponent : function() {
		if(this.storeClass) {
			this.store = Ext.create(this.storeClass, {
				pageSize : this.pageSize
			});
		} else if(this.customSelectionUrl) {
			var url = (this.customSelectionUrl.lastIndexOf(login.current_domain_id, 0) === 0) ?
			'/domains/' + login.current_domain_id + '/diy_selections/' + this.customSelectionUrl + '/query.json' : 
			this.customSelectionUrl;
			
			this.store = Ext.create('Ext.data.Store', {
				fields: ['id', 'name', 'description'],
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
			// TODO 한글화 
			HF.msg.failure({msg : 'Bug : Store Class or Custom Selection URL not specified!'});
			return;
		}
		
		var self = this;
		
		if(this.associationField && this.associationField.length > 0) {
			var onceloaded = false;
			
			this.on('expand', function(field) {
				var store = field.getStore();
				if(!onceloaded) {
					onceloaded = true;
				} else {
					field.getStore().reload();
				}
			});
			
			this.store.on('beforeload', function(store, operation, opts) {
				var searchForm = self.up('form');
				var params = searchForm.getValues();
				var extraParams = {};
				Ext.Array.each(this.associationField, function(f) {
					if(self.storeClass) {
						extraParams['_q[' + f + ']'] = params[f];
					} else {
						extraParams[f] = params[f];
					}
				});

				store.getProxy().extraParams = extraParams;
			}, this);
		}
		
		this.callParent();
	},
	
	rawToValue: function(rawValue) {
		return this.value;
    },

    valueToRaw: function(value) {
		if(value && value.hasOwnProperty('name'))
			return value.name;

		return value;
	},
	
	setValue : function(v) {
		if(v && v.hasOwnProperty('name')) {
			v.toString = function() {
				return this.name
			}
		}
			
		this.callParent(arguments);
	},
	
	getValue : function() {
		return {
			id : (this.value && this.value.hasOwnProperty('name')) ? this.value.id : this.value,
			name : this.getDisplayValue(),
			toString : function() {
				return this.name
			}
		}
	}
});


Ext.define('Bar.view.report.GiBySerSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'bar_gi_by_ser_search',
	
	items : [
		{ xtype: 'daterange', fieldLabel: T('label.date'), name: 'whi_dt' },
/*		
		{ 
			fieldLabel : T('label.part_no'), 
			name : 'item_cd', 
			xtype : 'entitysearchcombo', 
			storeClass : 'Prod.store.Product', 
			submitSuffix : '',
			valueField : 'name', 
			associationField :  [ {
				name : 'prod_type-eq',
				value : function() {
					return 'RM';
				}
			} ]
		},
		{ 
			xtype: 'combobox', 
			fieldLabel : T('label.location'), 
			store : 'Bar.store.BarLoc', 
			name : 'loc_cd_to', 
			displayField: 'name', 
			valueField: 'loc_cd'
		},
		{ 
			xtype: 'combobox', 
			fieldLabel : 'To ' + T('label.location'), 
			store : 'Bar.store.BarLoc', 
			name : 'loc_cd_from', 
			displayField: 'name', 
			valueField: 'loc_cd'
		}
		*/
	]
	
});

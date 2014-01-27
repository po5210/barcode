Ext.define('Bar.view.report.GrByMatSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'bar_gr_by_mat_search',
	
	items : [
		{ 
			xtype: 'daterange', 
			fieldLabel: T('label.date'), 
			name: 'in_dt' 
		}/*,
		{ 
			fieldLabel : T('label.part_no'), 
			name : 'item_cd', 
			xtype : 'entitysearchcombo',
			storeClass : 'Prod.store.Product',
			associationField : [ {
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
			fieldLabel : 'From ' + T('label.location'), 
			store : 'Bar.store.BarLoc', 
			name : 'loc_cd_from', 
			displayField: 'name', 
			valueField: 'loc_cd'
		}*/
	]
	
});

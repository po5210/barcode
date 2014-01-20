Ext.define('Bar.view.instock.InstockSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'bar_instock_search',
		
	items : [
		{ 
			name : 'date', 
			fieldLabel : T('label.date'), 
			xtype : 'datefield', 
			format : T('format.date'), 
			submitFormat : T('format.submitDate') 
		},
		{ 
			fieldLabel : T('label.invoice_no'), 
			name : 'invoice_no', 
			xtype : 'textfield'
		},		
		{ 
			fieldLabel : T('label.supplier'), 
			name : 'supplier', 
			xtype : 'entitysearchcombo', 
			storeClass : 'Bar.store.Trade', 
			valueField : 'name' 
		}
	]
	
});
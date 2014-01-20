Ext.define('Bar.view.invoice.InvoiceSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'bar_invoice_search',
		
	items : [
		{ 
			name : 'date', 
			fieldLabel : T('label.date'), 
			xtype : 'datefield', 
			format : T('format.date'), 
			submitFormat : T('format.submitDate') 
		},
		{ 
			fieldLabel : T('label.supplier'), 
			name : 'supplier', 
			xtype : 'entitysearchcombo', 
			storeClass : 'Bar.store.Trade', 
			valueField : 'name' 
		},
		{
			fieldLabel : T('label.trade_no'),
			name : 'trade_no',
			xtype : 'textfield'
		},
		{ 
			fieldLabel : T('label.invoice_no'), 
			name : 'invoice_no', 
			xtype : 'textfield',
			storeClass : 'Bar.store.Invoice'
		},
		{ 
			name : 'invoice_date', 
			fieldLabel : T('label.invoice_date'), 
			xtype : 'datefield', 
			format : T('format.date'), 
			submitFormat : T('format.submitDate') 
		},
		{
			fieldLabel : T('label.po_no'),
			name : 'po_no',
			xtype : 'textfield'
		}
	]
	
});
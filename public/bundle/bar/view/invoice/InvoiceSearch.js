Ext.define('Bar.view.invoice.InvoiceSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'bar_invoice_search',
		
	items : [
		{ 
			name : 'bill_dt', 
			fieldLabel : T('label.date'), 
			xtype : 'datefield', 
			format : T('format.date'), 
			submitFormat : T('format.submitDate') 
		},
		{ 
			fieldLabel : T('label.supplier'), 
			name : 'tr_cd', 
			xtype : 'entitysearchcombo', 
			storeClass : 'Bar.store.Supplier', 
			valueField : 'name' 
		},
		{
			fieldLabel : T('label.bill_nb'),
			name : 'bill_nb',
			xtype : 'entitycombo',
			customSelectionUrl : '/domains/' + login.current_domain_id + '/diy_selections/SelectBarBillNbs/query.json',
			associationField : ['bill_dt', 'tr_cd'],
			editable : true
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
		},
		{ 
			fieldLabel : T('label.item'), 
			name : 'item_cd', 
			xtype : 'entitysearchcombo', 
			customSelectionUrl : '/domains/' + login.current_domain_id + '/diy_selections/SelectBarItems/query.json',
			associationField : ['tr_cd']
		},
		{ 
			name : 'lot_size', 
			fieldLabel : T('label.lot_size'),
			xtype : 'textfield',
			readOnly : true
		},
		{ 
			fieldLabel : T('label.unit_price'), 
			name : 'unit_price', 
			xtype : 'numberfield',
			minValue : 0
		}, 
		{ 
			fieldLabel : T('label.bill_qt'), 
			name : 'bill_qt', 
			xtype : 'numberfield',
			minValue : 0
			default : 0
		}				
	]
	
});
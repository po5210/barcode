Ext.define('Bar.view.instock.InstockSearch', {
	
	extend : 'Base.abstract.entity.ListSearchView',
	
	xtype : 'bar_instock_search',
		
	items : [
		{ 
			name : 'bill_dt', 
			fieldLabel : T('label.supply_date'), 
			xtype : 'datefield', 
			format : T('format.date'), 
			submitFormat : T('format.submitDate') 
		},
		{ 
			fieldLabel : T('label.bill_nb'), 
			name : 'bill_nb', 
			xtype : 'textfield'
		},		
		{ 
			fieldLabel : T('label.supplier'), 
			name : 'tr_cd', 
			xtype : 'textfield' 
		},
		{ 
			fieldLabel : T('label.invoice_date'), 
			name : 'invoice_date', 
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
			fieldLabel : T('label.po_no'), 
			name : 'po_no', 
			xtype : 'textfield'
		}		
	]
	
});
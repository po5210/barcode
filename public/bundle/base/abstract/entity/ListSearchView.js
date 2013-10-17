Ext.define('Base.abstract.entity.ListSearchView', {
	
	extend : 'Ext.form.Panel',
	
	xtype : 'base_entity_list_search',
	cls : 'listSearch',
	
	autoScroll : true,
	
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	
	// defaults : { xtype : 'textfield', anchor : '100%', labelAlign : 'top' },
	
	rbar : { 
		xtype : 'controlbar', 
		width : 55,
		layout : {
			type : 'hbox'
		},
		items : ['search','reset'] 
	},
	
	initComponent : function() {
		var items = this.items || [];
		this.items = [];
		
		var row;
		Ext.Array.each(items, function(item) {
			if(!row) {
				row = {
					xtype : 'container',
					defaults : {
						margin : 3,
						xtype : 'textfield'
					},
					layout : {
						type : 'hbox',
						align : 'stretch'
					},
					items : []
				};
			}
			
			if(item === '-') {
				item = {
					xtype : 'container'
				}
			}
			
			item.flex = 1;

			row.items.push(item);
			
			if(row.items.length == 2) {
				this.items.push(row);
				row = null;
			}
		}, this);
		
		if(row) {
			row.items.push({
				xtype : 'container',
				flex : 1
			});
			this.items.push(row)
		}
		
		this.callParent();
	}

});
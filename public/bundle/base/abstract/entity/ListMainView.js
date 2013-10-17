Ext.define('Base.abstract.entity.ListMainView', {
	
	extend: 'Base.abstract.Panel',
	
	xtype : 'base_entity_list_main',
		
	layout : { type : 'vbox', align : 'stretch' },
	
	initComponent : function() {

		this.callParent(arguments);
		
		if(this.gridView) {
			this.add({
				xtype : this.gridView,
				flex : 1
			});
		}
		
		if(this.subView) {
			this.add({
				xtype : 'splitter',
				collapsible : true
			});
			this.add({
				xtype : this.subView,
				header : false,
				flex : 1
			});
		}
	}
});
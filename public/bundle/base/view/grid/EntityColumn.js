Ext.define('Base.view.grid.EntityColumn', {
	extend: 'Ext.grid.column.Column',

	xtype: ['base_entitycolumn', 'entitycolumn'],

	defaultRenderer: function(v, meta, record, rowIdx, colIdx, store, view) {		
		return (v && v.hasOwnProperty('name')) ? v.name : v;
		// return (v && v instanceof Object) ? v.name : v;
	}
	
	// defaultRenderer: function(v, meta, record, rowIdx, colIdx, store, view) {
	// 	var rcname = this.dataIndex.substr(0, this.dataIndex.indexOf('_id'));
	// 	return record.get(rcname + '_name');
	// }

	// defaultRenderer: function(v, meta, record, rowIdx, colIdx, store, view) {
	// 	var obj = record.get(this.dataIndex.substr(0, this.dataIndex.indexOf('_id')));
	// 	
	// 	return obj ? obj.name : '';
	// }
});

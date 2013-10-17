Ext.define('Base.view.grid.CodeColumn', {
	extend: 'Ext.grid.column.Column',

	xtype: ['base_codecolumn', 'codecolumn'],

	defaultRenderer: function(v, meta, record, rowIdx, colIdx, store, view) {
		if(!this.tpl) {
			return v;
		}
		return this.tpl.apply(HF.code(this.commonCode, v) || {
			name : '',
			description : ''
		});
	}
});

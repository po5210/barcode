Ext.define('Base.view.user.UserLinkColumn', {
	extend: 'Base.view.grid.TextLinkColumn',
	
	xtype : 'base_usercolumn',
	
   defaultRenderer: function(v, meta, record, rowIdx, colIdx, store, view){
       var me = this,
       prefix = Ext.baseCSSPrefix,
       scope = me.origScope || me,
       tooltip;
 
       meta.tdCls += ' link';
       // Allow a configured renderer to create initial value (And set the other values in the "metadata" argument!)
       v = Ext.isFunction(me.origRenderer) ? me.origRenderer.apply(scope, arguments) || '' : v;

       tooltip = me.tooltip || (me.getTip ? me.getTip.apply(scope, arguments) : null);

            // Only process the item action setup once.
        if (!me.hasActionConfiguration) {
            // Apply our documented default to all items
            me.stopSelection;
            me.hasActionConfiguration = true;
        }

		// 사용자 value는 오브텍트 타입이므로, v.name을 보여준다.
	    return '<span class="' + prefix + 'action-col-icon '+ (Ext.isFunction(me.getClass) ? me.getClass.apply(scope, arguments) : (me.iconCls || '')) + '"' +
	        (tooltip ? ' data-qtip="' + tooltip + '"' : '') + ' >' + v.name + '</span>';
    
    },

    processEvent : function(type, view, cell, recordIndex, cellIndex, e, record, row){
        var me = this,
            target = e.getTarget(),
            match,
            fn,
            key = type == 'keydown' && e.getKey();

        // If the target was not within a cell (ie it's a keydown event from the View), then
        // rely on the selection data injected by View.processUIEvent to grab the
        // first action icon from the selected cell.
        if (key && !Ext.fly(target).findParent(view.cellSelector)) {
            target = Ext.fly(cell).down('.' + Ext.baseCSSPrefix + 'action-col-icon', true);
        }
        if (target) {
            if (type == 'click' || (key == e.ENTER || key == e.SPACE)) {
                fn = me.handler;
                if (fn) {
                    fn.call(me.origScope || me, view, recordIndex, cellIndex, me, e, record, row);
                } else {
					me.fireEvent('userpopup', me, record.get(me.dataIndex));
				}
				return false;
            } else if (type == 'mousedown' && me.stopSelection !== false) {
                return false;
            }
        }
        return me.callParent(arguments);
    }
});



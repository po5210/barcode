Ext.define('Base.view.role.RoleFieldSet', {
	extend : 'Ext.form.FieldSet',
	alias : 'widget.role_fieldset',
	
	createLegendCt: function () {
        var me = this,
            items = [],
            legend = {
                xtype: 'container',
                baseCls: me.baseCls + '-header',
                id: me.id + '-legend',
                autoEl: 'legend',
                items: items,
                ownerCt: me,
                ownerLayout: me.componentLayout
            };

        // Checkbox
        if (me.checkboxToggle) {
            items.push(me.createCheckboxCmp());
        } else if (me.collapsible) {
            // Toggle button
            items.push(me.createToggleCmp());
        }

        // Title
        items.push(me.createTitleCmp());
        
        items.push(me.createSelectCheckboxCmp());

        return legend;
    },
    
    createTitleCmp: function() {
        var me  = this,
            cfg = {
                xtype : 'component',
                html  : me.title + '&nbsp;',
                cls   : me.baseCls + '-header-text',
                id    : me.id + '-legendTitle'
            };

        if (me.collapsible && me.toggleOnTitleClick) {
            cfg.listeners = {
                click : {
                    element: 'el',
                    scope : me,
                    fn : me.toggle
                }
            };
            cfg.cls += ' ' + me.baseCls + '-header-text-collapsible';
        }

        return (me.titleCmp = Ext.widget(cfg));
    },
    
    createSelectCheckboxCmp: function() {
        var me = this,
            suffix = '-selctcheckbox';

        me.selectcheckboxCmp = Ext.widget({
            xtype: 'checkbox',
            hideEmptyLabel: true,
			name : this.formFieldName,
            cls: me.baseCls + '-header' + suffix,
            id: me.id + '-selectChk',
            checked: me.checkboxChecked,
            listeners: {
                change: me.onSelectCheckChange,
                scope: me
            }
        });
        return me.selectcheckboxCmp;
    },
    
    onSelectCheckChange: function(cmp, checked) {
    	this.dataValue.select = checked;
        var me  = this;
        var checkboxgroup = me.child('checkboxgroup');
        Ext.Array.each(checkboxgroup.items.items, function(value, key) {
        	value.setValue(checked);
        });
    },
    
    setAllCheck : function(checked){
    	if(!checked){
    		return;
    	}
    	this.dataValue.select = checked;
    	var me  = this;
    	me.selectcheckboxCmp.un('change', me.onSelectCheckChange, this);
    	me.selectcheckboxCmp.setValue(checked);
    	me.selectcheckboxCmp.on('change', me.onSelectCheckChange, this);
    }
});
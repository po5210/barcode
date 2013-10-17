Ext.define('Base.store.HatioCalendarEvent', {
	
	// requires : ['Extensible.calendar.data.EventStore'],
	// 
	// extend : 'Extensible.calendar.data.EventStore',
	// 
	// autoLoad: true,
	extend: 'Ext.data.Store',
    model: 'Ext.calendar.data.EventModel',

	autoLoad: false,
	
	proxy : {
		type : 'rest',
		//url : 'domains/' + login.current_domain_id + '/calendar_dates',
		url : '/domains/' + login.current_domain_id + '/diy_selections/WorkCalendar/query.json',
		reader : {
			type : 'json',
			root : 'items',
			totalProperty : 'total'
		},
		writer: {
            type: 'json',
			nameProperty: 'mapping'
        }
	},
	
	pageSize : 1000	
});
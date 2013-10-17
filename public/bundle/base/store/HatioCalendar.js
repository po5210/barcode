Ext.define('Base.store.HatioCalendar', {
	
	// requires : ['Extensible.calendar.data.MemoryCalendarStore'],
	// 
	// extend : 'Extensible.calendar.data.MemoryCalendarStore',
	// 
	// autoLoad: true,
	extend : 'Ext.calendar.data.MemoryCalendarStore',	
	data : {
        "calendars" : [ {
            "id"    : 1,
            "title" : "WorkCalendar-1",
            "color" : 2
        }, {
			"id"    : 2,
			"title" : "WorkCalendar-2",
			"color" : 4
        }, {
			"id"    : 3,
			"title" : "WorkCalendar-3",
			"color" : 6
        }, {
			"id"    : 4,
			"title" : "WorkCalendar-4",
			"color" : 8
		}, {
            "id"    : 101,
            "title" : "MachineCheck-Plan",
            "color" : 26
        }, {
            "id"    : 102,
            "title" : "MachineCheck-Completed",
            "color" : 31
        } ]
    }

});
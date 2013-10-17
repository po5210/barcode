Ext.define('Base.model.Tracer', {
	extend : 'Ext.data.Model',
	
	fields : [{
		name : 'issued_by'
	}, {
		name : 'severity'
	}, {
		name : 'message'
	}, {
		name : 'source_class'
	}, {
		name : 'source_method'
	}, {
		name : 'trace'
	}, {
		name : 'server_params'
	}, {
		name : 'server_throwable_type'
	}, {
		name : 'server_throwable_message'
	}, {
		name : 'server_throwable_trace'
	}, {
		name : 'issued_at',
		type : 'date',
		dateFormat : 'time'
	}]
});
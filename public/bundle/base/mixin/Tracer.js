Ext.define('Base.mixin.Tracer', {
	constructor : function(config) {
		function onTraceHandler(severity, msg, e) {
			var store = Ext.getStore('Base.store.Tracer');
			
			var client_trace = msg + '\n' + printStackTrace({
				e: e
			}).join('\n');
			
			store.add({
				severity : severity,
				message : msg,
				trace : client_trace, 
				source_class : e ? e.sourceClass : '',
				source_method : e ? e.sourceMethod : '',
				issued_at : e ? e.issuedAt : new Date(),
				issued_by : e ? e.issuedBy : '',
				server_params : (e.server_response && e.server_response.params) ? e.server_response.params : '',
				server_throwable_type : (e.server_response && e.server_response.throwable) ? e.server_response.throwable.type : '',
				server_throwable_message : (e.server_response && e.server_response.throwable) ? e.server_response.throwable.message : '',
				server_throwable_trace : (e.server_response && e.server_response.throwable) ? e.server_response.throwable.stacktrace : ''
			});
		}
		
		function onError(msg, e) {
			onTraceHandler('error', msg, e);
		}
		function onWarn(msg, e) {
			onTraceHandler('warn', msg, e);
		}
		function onTrace(msg, e) {
			onTraceHandler('trace', msg, e);
		}
		function onInfo(msg, e) {
			onTraceHandler('info', msg, e);
		}
		
		HF.logger.on('error', onError);
		HF.logger.on('warn', onWarn);
		HF.logger.on('trace', onTrace);
		HF.logger.on('info', onInfo);
	}
});

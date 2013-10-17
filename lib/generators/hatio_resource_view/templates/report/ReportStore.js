Ext.define('<%= @bundle %>.store.<%= class_name %>', {
	
	extend : 'Ext.data.Store',
	
	<%= HatioReportViewUtil.generateStore(@domain, @out_params) %>,
	
	autoLoad : false,
	
	remoteFilter : true,
	
	proxy : {
		type : 'ajax',
		url : <%= @service_url %>,
		format : 'json',
		reader : {
			type : 'json'
		}
	}
		
});
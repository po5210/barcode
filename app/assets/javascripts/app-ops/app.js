Ext.onReady(function() {
	Ext.application({
		appFolder: 'assets/app-ops',
	    autoCreateViewport: true,
	    name: 'App',
    
		controllers : [ 'ApplicationController' ]
				.concat(Bundle.controllers()),

	    launch: function() {
			var lp = document.getElementById('_loadprogress');
			if (lp)
				document.body.removeChild(lp);
	    }
	});
});
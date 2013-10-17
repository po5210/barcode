Ext.define('App.Base', {
	
	alternateClassName : ['HF'],
	
	singleton : true,

	mixins : {
		ext : 'mixin.Ext',
		log : 'mixin.Log',
		ajaxaspect : 'mixin.AjaxAspect',
		nav : 'mixin.Nav',
		history : 'mixin.History',
		localstore : 'mixin.LocalStore',
		mixin : 'mixin.Mixin',
		util : 'mixin.Util',
		beep : 'mixin.Beep',
		msg : 'mixin.Msg',
		should : 'mixin.Should',
		vtypes : 'mixin.VTypes'
	}
});

initLocalization({
	scope : this,
	language : login.locale,
	paths : LOCALE_RESOURCE ? [] : ['domains/' + login.current_domain_id + '/terminologies/locale_resource.json?locale=' + login.locale]
});

if(LOCALE_RESOURCE)
	T(LOCALE_RESOURCE);

Ext.Loader.setConfig({
    enabled: true,
    paths : {
		'App' : 'assets/app-ops',
		'Ext.ux' : 'js/ux'
    }
});

Bundle = function() {
	var bundles_order = [];
	var bundles = {};

	function getBundles() {
		return bundles;
	}
	
	function getBundle(bundle) {
		return bundles[bundle];
	}

	function loadResources(bundle_name, compressed) {
		// loadLocaleResource('bundle/' + bundle_name + '/locale', login.locale);
		if(compressed)
			document.write('<script type="text/javascript" src="bundle/' + bundle_name + '/' + bundle_name + '.js"></script>');
	}
	
	function use(bundle_name, controllers, compressed) {
		if (bundles[bundle_name])
			return;

		bundles[bundle_name] = controllers;
		bundles_order.push(bundle_name);

		Ext.Loader.setPath(bundle_name, 'bundle/' + Ext.String.uncapitalize(bundle_name));
		loadResources(Ext.String.uncapitalize(bundle_name), compressed);
	}

	function getAllControllers() {
		var joined = [];
		for(var i = 0;i < bundles_order.length;i++)
			joined = joined.concat(bundles[bundles_order[i]]);

		return joined;
	}
	
	return {
		bundles : getBundles,
		use : use,
		controllers : getAllControllers,
		get : getBundle
	};
	
}();

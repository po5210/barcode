Ext.define('mixin.Beep', function() {
	var div;
	
	function beep_div() {
		if(!div) {
			div = document.createElement('div');
			div.setAttribute('id', '__beep__');
			document.body.appendChild(div);			
		}
		
		return div;
	}
	
	function beep(url) {
		beep_div().innerHTML=
			"<embed src='" + url + "' hidden=true autostart=true loop=false>";
	}
	
	function notice() {
		beep('theme/sound/notice.wav');
	}
	
	function failure() {
		beep('theme/sound/failure.wav');
	};
	
	function success() {
		beep('theme/sound/success.wav');
	};
	
	return {
		beep : {
			beep : beep,
			notice : notice,
			failure : failure,
			success : success
		}
	};
}());
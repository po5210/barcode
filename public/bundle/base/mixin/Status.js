Ext.define('Base.mixin.Status', {
	constructor : function(config) {
		var _status;
		var _progress;
		
		var _fakeStatus = {
			setStatus : Ext.emptyFn,
			showBusy : Ext.emptyFn,
			clearStatus : Ext.emptyFn,
			add : Ext.emptyFn
		};
		
		var _fakeProgress = {
			wait : Ext.emptyFn,
			reset : Ext.emptyFn,
			updateText : Ext.emptyFn
		};
		
		function status() {
			if(!_status)
				_status = Ext.getCmp('statusbar');
			return _status || _fakeStatus;
		}
		
		function progress() {
			if(!_progress)
				_progress = Ext.getCmp('progressbar');
			return _progress || _fakeProgress;
		}
		
		function set(state) {
			status().setStatus(state);
		}
		
		function get(itemId) {
			return status().sub(itemId);
		}
		
		function busy(o) {
			status().showBusy(o);
		}
		
		function clear() {
			status().clearStatus({
				useDefaults : true
			});
		}
		
		function tray(o, index) {
			if(Ext.typeOf(index) == 'number'){
				status().insert(index, o);
			}else{
				status().add(o);
			}
		}
		
		/* AJAX Event Handling for Status */
		var loadText = T('text.Server Processing');
		var cnt = 0;
		
		function onComplete(conn, resp, options, eOpts) {
			if (--cnt <= 0) {
				cnt = 0;
				progress().reset();
				progress().updateText('');
			}
		}
		
		function onException(conn, resp, options, eOpts) {
			if (--cnt <= 0) {
				cnt = 0;
				progress().reset();
				progress().updateText('');
			}
		}

		function onBefore(conn, options, eOpts) {
			/*
			 * 파일 Upload는 iframe을 이용한 Fake Ajax이므로, 매칭되는 onComplete 이벤트가 발생하지 않는다.
			 * Ext.Ajax.request 도큐먼트를 참조하시오.
			 */
			if(options.isUpload) {
				return;
			}
			
			if (++cnt > 0) {
				progress().wait({
				   interval: 500,
				   duration: 50000,
				   increment: 15,
				   text: loadText,
				   scope: this
				});
			}
		}

		Ext.Ajax.on('requestcomplete', onComplete);
		Ext.Ajax.on('requestexception', onException);
		Ext.Ajax.on('beforerequest', onBefore);

		/* Logger Event Handling for Status */
				
		function onError(msg, e) {
			set({
				text : msg,
				iconCls : 'x-status-error',
				clear: {
					anim: false
				}
			});
		}
		
		function onWarn(msg, e) {
			set({
				text : msg,
				iconCls : 'x-status-warn',
				clear: {
					anim: false
				}
			});
		}
		
		function onInfo(msg) {
			set({
				text : msg,
				iconCls : 'x-status-info',
				clear: {
					anim: false
				}
			});
		}
		
		HF.logger.on('error', onError);
		HF.logger.on('warn', onWarn);
		HF.logger.on('info', onInfo);
		
		return {
			status : {
				set : set,
				get : get,
				busy : busy,
				clear : clear,
				tray : tray
			}
		};
	}
});

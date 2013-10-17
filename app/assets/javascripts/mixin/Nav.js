Ext.define('mixin.Nav', function(){
		function show(view, params, config) {
			var content = Ext.getCmp('content');
			
			HF.should.not_be_empty(content);
			
			var screen = null;
			
			if (Ext.isString(view)) {
				
				try{
					if(!Ext.ClassManager.get(view)) {
						var controller = view.replace('.view.', '.controller.');
						Ext.syncRequire(controller);
						App.getApplication().getController(controller);
					}
				
					screen = content.getComponent(view) || content.insert(0, Ext.create(view, Ext.merge({
						itemId : view,
						header : false
					}, config)));
				} catch(e) {
					HF.error(T('error.LOAD-FAILURE', {
						view : view
					}), e);
					return;
				}
			}

			if(screen.setParams) {
				screen.setParams(params);
			} else {
				HF.history.add(view, params);
			}
			
			content.fireEvent('showcontent', content, screen);
		}
		
		function popup(view, params, config) {
			var screen = null;
			
			if (Ext.isString(view)) {
				
				try{
					if(!Ext.ClassManager.get(view)) {
						var controller = view.replace('.view.', '.controller.');
						Ext.syncRequire(controller);
						App.getApplication().getController(controller);
					}
                                                                                                                                                    
					screen = Ext.create(view, Ext.merge({
						modal : true
					}, config));
					
					if(config && config.by)
						screen.showBy(config.by)
					else
						screen.show();
				} catch(e) {
					HF.error(T('error.LOAD-FAILURE', {
						view : view
					}), e);
					return;
				}
			}
			
			if(screen.setParams) {
				screen.setParams(params);
			}
		}
		
		var titleBarAddendums = [];
		var optionBarAddendums = [];
		var topBarAddendums = [];
		var statusBarAddendums = [];
		var settingAddendums = [];
		
		function titlebar(component) {
			if(component) {
				if(component instanceof Array) {
					Ext.Array.each(component, function(comp) {
						titleBarAddendums.push(comp);
					});
				} else {
					titleBarAddendums.push(component);
				}
			}

			return titleBarAddendums;
		}
		
		function optionbar(component) {
			if(component) {
				if(component instanceof Array) {
					Ext.Array.each(component, function(comp) {
						optionBarAddendums.push(comp);
					});
				} else {
					optionBarAddendums.push(component);
				}
			}

			return optionBarAddendums;
		}
		
		function topbar(component) {
			if(component) {
				if(component instanceof Array) {
					Ext.Array.each(component, function(comp) {
						topBarAddendums.push(comp);
					});
				} else {
					topBarAddendums.push(component);
				}
			}

			return topBarAddendums;
		}
		
		function setting(component) {
			if(component) {
				if(component instanceof Array) {
					Ext.Array.each(component, function(comp) {
						settingAddendums.push(comp);
					});
				} else {
					settingAddendums.push(component);
				}
			}

			return settingAddendums;
		}
		
		function statusbar(component) {
			if(component) {
				if(component instanceof Array) {
					Ext.Array.each(component, function(comp) {
						statusBarAddendums.push(comp);
					});
				} else {
					statusBarAddendums.push(component);
				}
			}

			return statusBarAddendums;
		}
		
		var downloader;
		
		function download(url) {
			if(!downloader) {
				downloader = Ext.getCmp('downloader');
			}
			if(!downloader) {
				// TODO Error Messages Here.
				return;
			}
			downloader.load({
				url : url
			});
		}
		
		var slideshowbar;
		
		function slideshow(attachments) {
			if(!Ext.isArray(attachments) || attachments.length == 0)
				return;

			if(!slideshowbar) {
				slideshowbar = Ext.getCmp('slideshowbar');
			}
			if(!slideshowbar) {
				// TODO Error Messages Here.
				return;
			}
			
			var images = Ext.Array.filter(attachments, function(attachment) {
				if(attachment.mimetype && attachment.mimetype.indexOf('image') === 0)
					return true;
				return false;
			});
			
			slideshowbar.update(images);
			
			if(images.length == 0)
				return;
				
			$(slideshowbar.getEl().dom).children('a').colorbox({rel:'group'}).eq(0).click();
		}
		
		// TODO 세련되게 수정.
		function setTitle(title) {
			Ext.getCmp('title').setText(title);
		}
		
		var contentLayout;
		
		function currentview() {
			if(!contentLayout) {
				contentLayout = Ext.getCmp('content').getLayout();
			}
			if(!contentLayout)
				return;
				
			return contentLayout.getActiveItem();
		}
		
		return {
			show : show,
			popup : popup,
			setTitle : setTitle,
			current : {
				view : currentview
			},
			download : download,
			slideshow : slideshow,
			custom : {
				topbar : topbar,
				optionbar : optionbar,
				titlebar : titlebar,
				statusbar : statusbar,
				setting : setting
			}
		};
}());

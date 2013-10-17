/**
 * Print Setting Controller
 */
Ext.define('Ops.controller.prt.PrintSetting', {
	
	extend : 'Ops.abstract.OpsController',
	
	views : ['Ops.view.prt.PrintSetting'],
	
	refs: [
		{ ref : 'MainView', selector : 'ops_prt_setting' }
	],
	
	init : function() {
		this.control({
			'ops_prt_setting' : {
				paramschange : this.onParamsChange,
				click_connect : this.onConnect,
				click_test : this.onTest,
				click_save : this.onClickSave,
				click_close : this.onClickClose
			}
		});
	},
	
	onParamsChange : function(view, params) {
	},
	
	onClickSave: function(popup) {
		var form = popup.child('form');
		var data = form.getForm().getValues();
		
		if(!data.agent_url || data.agent_url == '') {
			HF.msg.notice(T('text.Select x First', {x : T('label.agent_url')}));
			return;
		}
		
		if(!data.print_interval || data.print_interval == '') {
			HF.msg.notice(T('text.Select x First', {x : T('label.print_interval')}));
			return;
		}

		var oldAgentUrl = HF.setting.get('setting-agent-url');
		var oldPrintInterval = HF.setting.get('setting-print_interval');
		
		HF.setting.set('setting-agent-url', data.agent_url);
		HF.setting.set('setting-print_interval', data.print_interval);
		
		var self = this;
		var chkValid = this.validConnectionInfo();
		if(chkValid) {
			self.onClickClose(popup);
			self.connectWs();
		} else {
			self.confirmSave(form, '(Invalid Connection URL)', oldAgentUrl, oldPrintInterval);
		}
	},
	
	confirmSave : function(form, msg, oldAgentUrl, oldPrintInterval) {
		HF.msg.confirm({
			msg : 'Connection Failure ' + msg + ', But ' + T('text.Sure to Save'),
			fn : function(btn) {
				if(btn != 'yes') {
					form.down('textfield[name=agent_url]').setValue(oldAgentUrl);
					form.down('textfield[name=print_interval]').setValue(oldPrintInterval);
					HF.setting.set('setting-agent-url', oldAgentUrl);
					HF.setting.set('setting-print_interval', oldPrintInterval);
				}
			},
			scope: this
		});
	},

	/**
	 * Connection Test
	 */
	onConnect : function() {
		var wsState = HF.agent.state();

		if(wsState == 'open') {
			HF.msg.notice('Print Agent Already Connected!');
		} else {
			this.connectWs();
		}
	},
	
	/**
	 * Command Send Test
	 */
	onTest : function() {
		var wsState = HF.agent.state();
		if(wsState != 'open') {
			this.connectWs();
		}
		
		var msg = "<STX><ESC>C<ETX>";
		msg += "<STX><ESC>P<ETX>";
		msg += "<STX>E5;F5<ETX>";
		msg += "<STX>H0;o35,40;c0;d3,Supp(V);k6<ETX>";
		msg += "<STX>H1;o500,40;c0;d3,Halla Visteon;k6<ETX>";
		msg += "<STX>B2;o80,100;c0,0;d0,20;w4;i1;h125;p@<ETX>";
		msg += "<STX>H3;o915,80;c0;d3,6652A;k24<ETX>";
		msg += "<STX>L4;o35,250;l2200;w8<ETX>";
		msg += "<STX>H5;o35,280;c0;d3,QTY;k6<ETX>";
		msg += "<STX>H6;o300,320;c0;d3,12;k20<ETX>";
		msg += "<STX>B7;o80,450;c0,0;d0,20;w4;i1;h125;p@<ETX>";
		msg += "<STX>H8;o600,480;c0;d3,EA;k12<ETX>";
		msg += "<STX>L9;o35,630;l2200;w8<ETX>";
		msg += "<STX>L10;o800,250;f3;l380;w8<ETX>";
		msg += "<STX>H11;o830,280;c0;d3,Container;k6<ETX>";
		msg += "<STX>H12;o830,320;c0;d3,FE12627;k12<ETX>";
		msg += "<STX>H13;o830,400;c0;d3,GROSS WEIGHT;k6<ETX>";
		msg += "<STX>H14;o830,440;c0;d3,384.2;k12<ETX>";
		msg += "<STX>H15;o1230,440;c0;d3,KG;k10<ETX>";
		msg += "<STX>H16;o830,520;c0;d3,DATE;k6<ETX>";
		msg += "<STX>H17;o830,560;c0;d3,30JUL2013;k12<ETX>";
		msg += "<STX>H18;o80,680;c0;d3,AV11-19B555-BD;k30<ETX>";
		msg += "<STX>H19;o80,900;c0;d3,PART(p);k6<ETX>";
		msg += "<STX>B20;o300,860;c0,0;d0,20;w5;i1;h125;p@<ETX>";
		msg += "<STX>L21;o35,1020;l2200;w8<ETX>";
		msg += "<STX>H22;o35,1040;c0;d3,STR LOC 1;k6<ETX>";
		msg += "<STX>H23;o35,1100;c0;d3,M16DG01;k20<ETX>";
		msg += "<STX>L24;o1100,1020;f3;l200;w8<ETX>";
		msg += "<STX>H25;o1120,1040;c0;d3,Delivery Doc/ASN Number;k6<ETX>";
		msg += "<STX>L26;o35,1220;l2200;w8<ETX>";
		msg += "<STX>H27;o80,1260;c0;d3,AV-19B555-BD;k7<ETX>";
		msg += "<STX>H28;o80,1340;c0;d3,EVAPORATOR AND BLOWER AS;k7<ETX>";
		msg += "<STX>H29;o35,1420;c0;d3,SERIAL No.(S);k6<ETX>";
		msg += "<STX>H30;o500,1420;c0;d3,10020021;k7<ETX>";
		msg += "<STX>B31;o100,1500;c0,0;d0,20;w5;i1;h125;p@<ETX>";
		msg += "<STX>L32;o1200,1220;f3;l480;w8<ETX>";
		msg += "<STX>H33;o1240,1260;c0;d3,TO;k7<ETX>";
		msg += "<STX>H34;o1800,1260;c0;d3,DOCK CODE;k7<ETX>";
		msg += "<STX>H35;o1240,1320;c0;d3,FORD ROMANIA SA;k9<ETX>";
		msg += "<STX>H36;o1340,1420;c0;d3,CUST;k7<ETX>";
		msg += "<STX>H37;o1240,1490;c0;d3,EK5XA;k20<ETX>";
		msg += "<STX>H38;o1800,1400;c0;d3,J3;k30<ETX>";
		msg += "<STX>H39;o1240,1620;c0;d3,ENG ALERT;k7<ETX>";
		msg += "<STX>R<ETX>";
		msg += "<STX><ESC>E5<CAN><ETX>";
		msg += "<STX><ESC>F2<LF>6652A<ETX>";
		msg += "<STX><ESC>F7<LF>12<ETX>";
		msg += "<STX><ESC>F20<LF>AV11-19B555-BD<ETX>";
		msg += "<STX><ESC>F31<LF>10020021<ETX>";
		msg += "<STX><ETB><ETX>";
		
		Ext.Msg.show({
			title      : 'Label Print Test',
			msg        : 'Label Command',
			width      : 650,
			height 	   : 450,
			buttons    : Ext.MessageBox.OKCANCEL,
			fn         : function(btn, text, cfg) {
			    if(btn == 'ok' && !Ext.isEmpty(text)) {
					var printMsg = {
						"requestId" : "1",
						"labelPlanId" : "System-0db3c0573cf47b10155507bfbe3997e633724d8f",
					 	"msgType" : "PRINT",
					 	"msg" : text
					};

					HF.agent.request(printMsg, function(response) {
						if(response.success) {
							HF.msg.success('Success to Transfer Test Label To Print Agent!');
						} else {
							HF.msg.failure(response.msg + ' (' + response.details + ')');
						}
					}, this);
			    }
			},
			multiline  : true,
			value      : msg,
			prompt     : true,
			scope      : this
		});
		
		/*Ext.Msg.prompt('Label Test', 'Label Command :', function(btn, text, cfg) {
		    if(btn == 'ok' && !Ext.isEmpty(text)) {
				var printMsg = {
					"requestId" : "1",
					"labelPlanId" : "System-0db3c0573cf47b10155507bfbe3997e633724d8f",
				 	"msgType" : "PRINT",
				 	"msg" : text
				};
				
				HF.agent.request(printMsg, function(response) {
					if(response.success) {
						HF.msg.success('Success to Transfer Test Label To Print Agent!');
					} else {
						HF.msg.failure(response.msg + ' (' + response.details + ')');
					}
				}, this);
		    }
		}, this, true, msg);*/
	},
	
	/**
	 * WebSocket reconnect
	 */
	connectWs : function() {
		HF.agent.disconnect();
		HF.agent.on('open', function(url) {
			HF.msg.success('Success To Connect To Print Agent!');
		});
		HF.agent.on('error', function(error) {
			HF.msg.failure('Connection Error (' + error + ')');
		});
		HF.agent.on('close', function(url, evtCode, evtReason) {
			//HF.msg.notice('Connection Closed (Code : ' + evtCode + ', Reason : ' + evtReason + ')');
			HF.agent.connect();
		});
	},
	
	/**
	 * validate connection information
	 */
	validConnectionInfo : function() {
		var agentUrl = HF.setting.get('setting-agent-url');
		// TODO 정규 표현식으로 체크 
		if(agentUrl.indexOf('ws://') == 0) {
			return true;
		} else {
			return false;
		}
	}
});
Ext.define('Ops.controller.prod.ModifyOperator', {
	
	extend : 'Ops.abstract.OpsController',
	
	views : ['Ops.view.prod.ModifyOperator'],
	
	refs: [
		{ ref : 'ModifyOperator', selector : 'ops_modify_operator' },
		{ ref : 'MainView', selector : 'ops_prod_main' }
	],
	
	init : function() {
		this.control({
			'ops_modify_operator' : {
				paramschange : this.onParamsChange,
				click_save : this.onClickSave,
				click_close : this.onClickClose,
				click_add : this.onGridAdd,
				click_moveup : this.onClickUp,
				click_movedown : this.onClickDown
			}
		});
	},
	
	onParamsChange : function(view, params) {
		view.child(' #date').setValue(HF.setting.get('option-work_date_disp'));
		view.child(' #shift').setValue(SHIFT_NAME);
		view.child(' #operation').setValue(params.operation);
		view.child(' #machine').setValue(params.machine);
		var gridStore = view.child('grid').getStore();
		
		// 작업자 변경 : 현재 선택한 작업의 작업자 리스트를 조회하여 뿌려준다.
		gridStore.getProxy().extraParams = {
			prod_order_id : view.getParams().id
		};

		// 기존에 등록된 작업자는 변경하지 못하고 추가 혹은 삭제만 가능하다.
		view.child('grid').on('beforeedit', function(editor, e, eOpts) {
			var recordId = e.record.get('id');
			if(recordId == '' || e.colIdx > 1) {
				return true;
			} else {
				return false;
			}
		});

		gridStore.load();
	},
	
	/**
	 * Move Up 버튼 클릭시 
	 */
	onClickUp : function() {
		var grid = this.getModifyOperator().child('grid');
		grid.scrollByDeltaY(-100);
	},
	
	/**
	 * Move Down 버튼 클릭시 
	 */
	onClickDown : function() {
		var grid = this.getModifyOperator().child('grid');
		grid.scrollByDeltaY(100);
	},
	
	/**
	 * 저장 버튼 클릭시 
	 */
	onClickSave: function(popup) {
		var viewParams = popup.getParams();
		var jobStatus = viewParams.status;
		var prodMainView = this.getMainView();
		var gridStore = popup.child('grid').getStore();
		
		if(!this.checkValidate(gridStore, jobStatus)) {
			return;
		}
		
		var newRecords = gridStore.getNewRecords();
		var modifiedRecords = gridStore.getModifiedRecords();
		var removedRecords = gridStore.getRemovedRecords();

		var newOperators = [];
		var modifiedOperators = [];
		var removedOperators = [];
		var params = {prod_order_id : viewParams.id};
		var work_date = HF.setting.get('option-work_date');
		var shift = HF.setting.get('option-shift');
		
		for (var i = 0 ; i < newRecords.length ; i++) {
			var newData = newRecords[i].data;
			if(newData.user && newData.start_time) {
				var startTime = HF.getSysTime(work_date, shift, Ext.util.Format.date(newData.start_time, T('format.time')));
				var endTime = (newData.end_time) ? HF.getSysTime(work_date, shift, Ext.util.Format.date(newData.end_time, T('format.time'))) : null;
				newOperators.push({
					'user_id' : newData.user.id, 
					'start_time' : startTime,
					'end_time' : endTime
				});
			}
		}
		
		for (var i = 0 ; i < modifiedRecords.length ; i++) {
			var modifiedData = modifiedRecords[i].data;
			if(modifiedData.user && modifiedData.start_time && modifiedData.id) {
				var startTime = HF.getSysTime(work_date, shift, Ext.util.Format.date(modifiedData.start_time, T('format.time')));
				var endTime = (modifiedData.end_time) ? HF.getSysTime(work_date, shift, Ext.util.Format.date(modifiedData.end_time, T('format.time'))) : null;
				modifiedOperators.push({
					'id' : modifiedData.id,
					'user_id' : modifiedData.user.id,
					'start_time' : startTime,
					'end_time' : endTime
				});
			}
		}
        
		for (var j = 0 ; j < removedRecords.length ; j++) {
			removedOperators.push({'id' : removedRecords[j].get('id')});
		}
		
		params.new_worker_times = Ext.JSON.encode(newOperators);
		params.modified_worker_times = Ext.JSON.encode(modifiedOperators);
		params.removed_worker_times = Ext.JSON.encode(removedOperators);

		var self = this;
		Ext.Ajax.request({
			//url : '/domains/' + login.current_domain_id + '/diy_services/OpsSaveOperators/shoot.json',
			url : '/domains/' + login.current_domain_id + '/ops/save_job_operators.json',
			method : 'POST',
			params : params,
			success : function(response, opts) {
				popup.close();
			}
		});
	},
	
	onGridAdd : function(btn) {
		var view = this.getModifyOperator().child('grid');
		var modifyOperatorStore = view.getStore();
		modifyOperatorStore.worker_add_row(new Date());
	},
	
	/**
	 * validation check
	 */
	checkValidate : function(gridStore, jobStatus) {
		// 1. 그리드에 데이터가 없으면 invalid
		if(gridStore.data.length == 0) {
			HF.msg.notice(T('text.Select x First', {x : T('label.operator')}));
			return false;
		}
		
		var newRecords = gridStore.getNewRecords();
		var modifiedRecords = gridStore.getModifiedRecords();
		
		// 2. 추가된 데이터 체크 
		if(!this.checkEmpty(newRecords, jobStatus) || !this.checkTime(newRecords)) {
			return false;
		}

		// 3. 변경된 데이터 체크
		if(!this.checkEmpty(modifiedRecords, jobStatus) || !this.checkTime(modifiedRecords)) {
			return false;
		}
		
		// TODO 작업시작 시간보다 작업자 시작시간이 작으면 validation
		// TODO 종료된 작업에 대한 작업자 변경인 경우 작업 종료시간 후 시간을 입력하지 못하도록 validation
		
		// 4. 중복 Operator 체크 
		if(!this.checkDuplicatedOperator(gridStore)) {
			return false;
		}
		
		return true;
	},
	
	/**
	 * record에 빈 값이 있는지 체크 
	 * 1) jobStatus가 진행(R) 중인 경우 : user, start_time이 없는 경우 체크 
	 * 2) jobStatus가 완료(T) 된 경우 : user, start_time, end_time이 없는 경우 체크 
	 */
	checkEmpty : function(records, jobStatus) {
		var valid = true;
		var invalidText = '';
		
		for(var i = 0 ; i < records.length ; i++) {
			var record = records[i];
			if(jobStatus == 'R') {
				valid = (record.data.user && record.data.user.id);
				if(!valid) {
					invalidText = 'operator';
				} else {
					valid = (record.data.start_time != null);
					if(!valid) {
						invalidText = 'start_time';
					}
				}
				
				if(!valid) {
					break;
				}
			} else {
				valid = (record.data.user && record.data.user.id);
				if(!valid) {
					invalidText = 'operator';
				} else {
					valid = (record.data.start_time != null);
					if(!valid) {
						invalidText = 'start_time';
					} else {
						valid = (record.data.end_time != null);
						if(!valid) {
							invalidText = 'end_time';
						} 
					}
				}
				
				if(!valid) {
					break;
				}
			}
		}
		
		if(!valid) {
			HF.msg.notice({title : T('text.Invalid data'), msg : T('text.Empty data exist') + ' : ' + T('label.' + invalidText)});
		}
		
		return valid;
	},
	
	/**
	 * 시간 체크, start_time, end_time이 있을 경우 : 각각 start_time이 end_time보다 크거나 end_time이 현재 시간보다 큰 경우
	 */
	checkTime : function(records) {
		var valid = true;
		var currentTime = new Date();
		var work_date = HF.setting.get('option-work_date');
		var shift = HF.setting.get('option-shift');
		var self = this;
		
		for(var i = 0 ; i < records.length ; i++) {
			var record = records[i];
			var startTime = HF.getSysTime(work_date, shift, Ext.util.Format.date(record.data.start_time, T('format.time')));
			if(!self.checkStartTime(startTime, currentTime) || !self.checkValidShiftTime(startTime)) {
				valid = false;
				break;
			}
			
			if(record.data.end_time && record.data.end_time != '') {
				var endTime = HF.getSysTime(work_date, shift, Ext.util.Format.date(record.data.end_time, T('format.time')));
				if(!self.checkEndTime(endTime, currentTime) || !self.checkValidShiftTime(endTime)) {
					valid = false;
					break;
				}
				
				if(!self.checkStartEndTime(startTime, endTime) || !self.checkValidShiftTime(endTime)) {
					valid = false;
					break;
				}
			} 
		}
		
		return valid;
	},
	
	/**
	 * StartTime이 현재 시간보다 큰 경우 validation error
	 */
	checkStartTime : function(startTime, currentTime) {
		if(startTime > currentTime) {
			HF.msg.notice({title : T('text.Invalid Time'), msg : T('text.X greater than Y', {x : T('label.start_time'), y : T('label.current_time')})});
			return false;
		} else {
			return true;
		}
	},
	
	/**
	 * EndTime이 현재 시간보다 큰 경우 validation error
	 */
	checkEndTime : function(endTime, currentTime) {
		if(endTime > currentTime) {
			HF.msg.notice({title : T('text.Invalid Time'), msg : T('text.X greater than Y', {x : T('label.end_time'), y : T('label.current_time')})});
			return false;
		} else {
			return true;
		}
	},
	
	/**
	 * StartTime이 EndTime 보다 큰 경우 validation error
	 */
	checkStartEndTime : function(startTime, endTime) {
		if(startTime > endTime) {
			HF.msg.notice({title : T('text.Invalid Time'), msg : T('text.X greater than Y', {x : T('label.start_time'), y : T('label.end_time')})});
			return false;
		} else {
			return true;
		}
	},
	
	/**
	 * 시간이 현재 시프트의 시간 내에 있는지 체크
	 */
	checkValidShiftTime : function(time) {
		var shiftStartTime = HF.getCurrentShiftStartTime();
		var shiftEndTime = HF.getCurrentShiftEndTime();
		
		if(time > shiftEndTime) {
			HF.msg.notice({title : T('text.Invalid Time'), msg : T('text.X greater than Y', {x : T('label.time'), y : T('label.shift_end_time')})});
			return false;
		} 
		
		if(time < shiftStartTime) {
			HF.msg.notice({title : T('text.Invalid Time'), msg : T('text.X less than Y', {x : T('label.time'), y : T('label.shift_start_time')})});
			return false;
		}
		
		return true;
	},
	
	/**
	 * job의 시작 시간 보다 작업자의 start time이 작거나 종료된 job의 경우 작업자의 job 종료시간 보다 end time이 클 경우 validation
	 */
	checkJobStartEndTime : function(jobStartTime, jobEndTime, workerStartTime, workerEndTime) {
		var valid = this.checkBetweenTime(jobStartTime, jobEndTime, workerStartTime);
		
		if(valid && jobEndTime) {
			valid = this.checkBetweenTime(jobStartTime, jobEndTime, workerEndTime);
		}
		
		return true;
	},
	
	/**
	 * 시간이 시작 시간과 종료 시간 사이에 있는지 체크
	 */
	checkBetweenTime : function(startTime, endTime, newTime) {
		if(newTime > startTime && newTime < endTime) {
			HF.msg.notice(T('text.Invalid Time'));
			return false;
		}
		
		return true;
	},
	
	/**
	 * Operator가 중복된 사용자가 있는지 체크 
	 */
	checkDuplicatedOperator : function(gridStore) {
		var valid = true;
		var invalidUser = null;
		var work_date = HF.setting.get('option-work_date');
		var shift = HF.setting.get('option-shift');
		var newRecords = gridStore.getNewRecords();
		var removedRecords = gridStore.getRemovedRecords();
		
		if(!newRecords || newRecords.length == 0) {
			return true;
		}
		
		var newUsers = [];
		for(var i = 0 ; i < newRecords.length ; i++) {
			var newUser = newRecords[i].data.user;
			if(newUsers.indexOf(newUser.id) >= 0) {
				valid = false;
				invalidUser = newUser;
				break;
			}
			newUsers.push(newUser.id);
		}
		
		if(!valid) {
			var invalidStr = invalidUser.name + ' (' + invalidUser.id + ')';
			HF.msg.notice(T('text.Duplicated X : Y', {x : T('label.operator'), y : invalidStr}));
			return false;
		}		
		
		var remUsers = [];
		if(removedRecords) {
			for(var i = 0 ; i < removedRecords.length ; i++) {
				remUsers.push(removedRecords[i].data.user.id);
			}
		}
		
		var self = this;
		gridStore.each(function(record) {
			var operator = record.data;
			if(operator.id && newUsers.indexOf(operator.user.id) >= 0 && remUsers.indexOf(operator.user.id) < 0) {
				if(!operator.end_time) {
					valid = false;
					invalidUser = operator.user;
					return false;
				} else {
					// newUsers에서 newUser 찾아서 newUser start_time, end_time이 operator start_time, end_time 사이에 있는지 체크 
					var newUser = null;
					for(var i = 0 ; i < newRecords.length ; i++) {
						if(newRecords[i].data.user.id == operator.user.id) {
							newUser = newRecords[i].data;
							break;
						}
					}
					
					if(newUser) {
						var newUserStartTime = HF.getSysTime(work_date, shift, Ext.util.Format.date(newUser.start_time, T('format.time')));
						var opStartTime = HF.getSysTime(work_date, shift, Ext.util.Format.date(operator.start_time, T('format.time')));
						var opEndTime = HF.getSysTime(work_date, shift, Ext.util.Format.date(operator.end_time, T('format.time')));

						valid = self.checkBetweenTime(opStartTime, opEndTime, newUserStartTime);
						if(valid && newUser.end_time) {
							var newUserEndTime = HF.getSysTime(work_date, shift, Ext.util.Format.date(newUser.end_time, T('format.time')));
							valid = self.checkBetweenTime(opStartTime, opEndTime, newUserEndTime);
						}
						
						if(!valid) {
							invalidUser = newUser.user;
							return false;
						}
					}		
				}
			}
		});
		
		if(!valid) {
			var invalidStr = invalidUser.name + ' (' + invalidUser.id + ')';
			HF.msg.notice(T('text.Duplicated X : Y', {x : T('label.operator'), y : invalidStr}));
			return false;
		}
		
		return true;
	}
});
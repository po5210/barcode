/**
 * Core controller
 * 자동화된 화면의 최상위 controller
 */
Ext.define('Base.abstract.entity.CoreController', {
	
	extend: 'Base.abstract.PanelController',
	
	/**
	 * view 하위의 아이템을 query를 수행하여 찾아 리턴한다.
	 *
	 * @view
	 * @query
	 * @return
	 */	
	queryItem : function(view, query) {
		var view = view || this.getMainView();
		return view.child(query);
	},
	
	/*************************************
	 *			Form Handling 			 *
	 *************************************/
	
	/**
	 * Form의 validatity가 변경될 때 - valid 하다면 save버튼을 활성화시키고 그렇지 않으면 비활성화 시킨다.
	 */
	onFormValidityChange: function(form, valid) {
		var btnSave = form.owner.down('button#save');
		if(btnSave) {
			btnSave.setDisabled(!valid);
		}
	},
	
	/**
	 * form reset
	 *
	 * @formView
	 */	
	resetFormData : function(formView) {
		formView.getForm().reset();
	},
	
	/**
	 * save form data
	 *
	 * @formView
	 */
	saveFormData : function(formView) {
		var form = formView.getForm();
		if (!form.isValid()) {
			HF.msg.notice(T('text.Invalid data'));
			return;
		}
		
		if (!this.validateLogic(form)) {
			return;
		}
		
		var self = this;
		HF.msg.confirm({
			msg : T('text.Sure to Save'),
			fn : function(btn) {
				if(btn != 'yes')
					return;
					
				var values = form.getValues();
				var entity = Ext.create(self.models[0], values);
				var errors = entity.validate();
				if(errors.isValid()) {
					entity.save({
						success : function(record, operation) {
							var newRecord = operation.resultSet.records[0];
							form.loadRecord(newRecord);
							formView.fireEvent('after_form_saved', form, newRecord);
						}
					});
				} else {
					var errorText = T('text.Form Validation check', {x : errors.length}) + "\n";
					for(var i = 0 ; i < errors.length; i++) {
						var error = errors.getAt(i);
						errorText += "[" + T('label.' + error.field) + "] field " + error.message + "\n";
						formView.child("[name=" + error.field + "]").focus();
					}
					HF.error(errorText);
				}
			},
			scope: this
		});
	},
	
	/**
	 * 추가적으로 필요한 validation을 수행 
	 */
	validateLogic : function(form) {
		return true;
	},
	
	/**
	 * delete form data
	 *
	 * @formView
	 */
	deleteFormData : function(formView) {
		var form = formView.getForm();
		var record = form.getRecord();
		
		if(!record || !record.getId()) {
			HF.msg.notice(T('text.Empty form data'));
			return;
		}
		
		HF.msg.confirm({
			msg : T('text.Sure to Delete'),
			fn : function(btn) {
				if(btn == 'yes') {
					record.destroy({
						success: function(record, operation) {
							formView.fireEvent('after_form_deleted', form, record, operation);
						}
					});
				}
			},
			scope: this
		});
	},
	
	/*************************************
	 *			Grid Handling 			 *
	 *************************************/
	/**
	 * 그리드에서 선택된 데이터를 삭제 
	 *
	 * @view
	 */
	onGridDelete : function(view) {
		this.deleteGridData(view, this.getMultipleUpdateUrl(view));
	},

	/**
	 * grid에 row 추가 
	 *
	 * @view
	 */
	onGridAdd : function(view) {
		this.addGridRow(view, this.newModel(view));
	},

	/**
	 * 추가, 삭제, 변경을 한 grid의 데이터를 저장 
	 *
	 * @view
	 */
	onGridSave : function(view) {
		this.saveGridData(view, this.getMultipleUpdateUrl(view));
	},

	/**
	 * 그리드 멀티플 업데이트 후 callback
	 * 
	 * grid grid
	 * @updateType update : u, delete : d
	 * @response grid update후 서버에서 보내준 response
	 */
	afterGridUpdated : function(grid, updateType, response) {
		this.getMainView().setParams(this.getMainView().getParams());
	},

	/**
	 * 모델 생성 ...
	 *
	 * @grid
	 * @data
	 */
	newModel : function(grid, data) {
		data = data || { domain_id : login.current_domain_id };
		return Ext.create(this.models[0], data);
	},
	
	/**
	 * grid reload by params
	 *
	 * @grid
	 * @params
	 * @return
	 */
	reload : function(grid, params) {
		params = params || {};
		params = this.buildGridParams(grid, params);
		var store = (grid && grid.columns && grid.store) ? grid.store : this.getMainStore();
        
		if(store.isLoading())
			return;
        
		store.proxy.extraParams = params;
        
		store.on('load', function(records, operation, success) {
			if(success) {
				grid.fireEvent('after_grid_loaded', records, operation);
			}
		});
        
		store.load({page : 1});
	},

	/**
	 * grid의 조회를 위한 search, select, sort 파라미터 정보를 생성한다.
	 *
	 * @grid
	 * @params
	 * @return
	 */
	buildGridParams : function(grid, params) {
		params = params || {};
		var searchParams = this.buildSearchParams(grid, params);
		var selectParams = this.buildSelectParams(grid, params);
		var sortParams = this.buildSortParams(grid, params);		
		searchParams['_s'] = "[" + selectParams.join(",") + "]";
		Ext.Array.each(sortParams, function(sortColumn) { searchParams['_o[' + sortColumn.name + ']'] = sortColumn.direction; });
		return searchParams;
	},

	/**
	 * grid의 조회를 위한 search 파라미터 정보를 생성한다.
	 *
	 * @grid
	 * @params
	 * @return
	 */
	buildSearchParams : function(grid, params) {
		var searchParams = {};
		Ext.Object.each(this.getDefaultFilters(), function(key, value) {
			params[key] = value;
		});		
		// search parameter 이름이 변경되면 여기서 변경 --> 설정사항으로 ...
		Ext.Object.each(params, function(key, value) {
			searchParams['_q[' + key + ']'] = value;
		});
		return searchParams;
	},

	/**
	 * grid의 조회를 위한 select 파라미터 정보를 생성한다.
	 *
	 * @grid
	 * @params
	 * @return
	 */
	buildSelectParams : function(grid, params) {
		var selectParams = [];
		// 그리드의 헤더 정보를 얻어와 select fields 파라미터를 만든다. select field 파라미터는 결정 필요
		Ext.Array.each(grid.columns, function(column) {
			if(column.dataIndex && column.dataIndex != '_cud_flag_') {
				selectParams.push(column.dataIndex);
			}
		});
		return selectParams;
	},

	/**
	 * grid의 조회를 위한 sort 파라미터 정보를 생성한다.
	 *
	 * @grid
	 * @params
	 * @return
	 */
	buildSortParams : function(grid, params) {
		var sortParams = [];
		Ext.Array.each(grid.columns, function(column) {
			if(column.sortOption) {
				var sortName = (column.xtype == 'entitycolumn') ? column.dataIndex + "_id" : column.dataIndex;
				sortParams.push({name : sortName, seq : column.sortOption.sortSeq, direction : column.sortOption.sortDirection});
			}
		});
		return Ext.Array.sort(sortParams, function(colA, colB) { 
			return (colA.seq > colB.seq) ? 1 : ((colA.v < colB.seq) ? -1 : 0);  
		});
	},

	/**
	 * default filter를 리턴 
	 */
	getDefaultFilters : function() {
		return { 'domain_id-eq' : login.current_domain_id };
	},
	
	/**
	 * 그리드에서 선택된 데이터를 삭제 
	 *
	 * @gridView 삭제할 그리드 데이터 
	 * @url 삭제 URL
	 */
	deleteGridData : function(gridView, url) {
		var selections = gridView.getSelectionModel().getSelection();
		if(selections.length > 0) {
			HF.msg.confirm({
				msg : T('text.Sure to Delete'),
				fn : function(confirmBtn) {
					if(confirmBtn == 'yes') {
						var records = [];
						Ext.Array.each(selections, function(selection) {
							// 이전에 삭제된 데이터가 같이 올라오는데 이 데이터에는 store가 null로 설정되어 있으므로 이 데이터는 제외 
							if(selection.data.id && selection.store) {
								selection.set('_cud_flag_', 'd');
								records.push(selection.data);
							}
						});
						if(records.length == 0) {
							HF.msg.notice(T('text.Nothing selected'));
						} else {
							this.updateMultiple(gridView, records, url);
						}
					}
				},
				scope : this
			});
		} else {
			HF.msg.notice(T('text.Nothing selected'));
		}
	},
	
	/**
	 * grid에 row 추가 
	 *
	 * @grid
	 * @newData
	 */
	addGridRow : function(gridView, newData) {
		gridView.store.insert(0, newData);
		gridView.plugins[0].startEditByPosition({row: 0, column: 0});
		gridView.fireEvent('after_grid_added', gridView, newData);
	},
	
	/**
	 * 추가, 삭제, 변경을 한 grid의 데이터를 저장 
	 *
	 * @grid
	 * @url 삭제 URL
	 */
	saveGridData : function(gridView, url) {
		HF.msg.confirm({
			msg : T('text.Sure to Save'),
			fn : function(confirmBtn) {
				if(confirmBtn == 'yes') {
					var store = gridView.store;
					var models = [];
					this.getStoreRecords(store, 'c', models);
					this.getStoreRecords(store, 'u', models);
					this.getStoreRecords(store, 'd', models);
					if(models.length == 0) {
						HF.msg.notice(T('text.Nothing changed'));
					} else {
						this.updateMultiple(gridView, models, url);
					}
				}
			},
			scope : this
		});
	},
	
	/**
	 * store에서 cudType에 따른 데이터를 찾아 recordList에 추가 
	 *
	 * @store
	 * @cudType : c || u || d
	 * @recordList cudType에 따라 찾은 데이터를 담을 list
	 */
	getStoreRecords : function(store, cudType, recordList) {
		var records = null;
		if(cudType == 'c') {
			records = store.getNewRecords();
		} else if(cudType == 'u') {
			records = store.getUpdatedRecords();
		} else if(cudType == 'd') {
			records = store.getRemovedRecords();
		}
		
		var self = this;
		Ext.each(records, function(record) {
			record.set('_cud_flag_', cudType);
			var data = self.validateMultipleUpdateData(Ext.clone(record.getData()));
			recordList.push(data);
		});
	},
	
	/**
	 * 서버로 전달되서는 안 되는 값을 제거하거나 값을 선처리한다.
	 * 
	 * @data
	 */
	validateMultipleUpdateData : function(data) {
		var referenceList = [];
		Ext.Object.each(data, function(key, value) {
			if(key.match("_id$") == "_id") {
				referenceList.push(key);
			}
		});
		
		// ..._id 로 되어 있는 필드를 모두 찾아서 위쪽 _id 필드에 값을 복사해주고 _id를 없앤 이름이 key인 필드를 모두 지운다.
		Ext.Array.each(referenceList, function(key) {
			var keyToDel = key.substr(0, key.length - 3);
			var value = data[keyToDel];
			// Object에 있는 값을 관련된 상위 id로 복사해 줌 
			if(Ext.isObject(value)) {
				if(data[key] != undefined && value.id) {
					data[key] = value.id;
				}
			}
			// Object 삭제 TODO 추후 entitycolumn component가 완성되면 위 Ext.isObject 괄호 안으로 들어가야 함 ...
			delete data[keyToDel];
		});
		
		Ext.Array.each(['creator', 'updater', 'creator_id', 'created_at', 'updater_id', 'updated_at'], function(key) {
			delete data[key];
		});
		return data;
	},
	
	/**
	 * created, updated, deleted records를 한꺼번에 생성, 수정, 삭제한다.  
	 *
	 * @gridView
	 * @records
	 * @url
	 */
	updateMultiple : function(gridView, records, url) {
		var updateType = records[0]._cud_flag_;
		var self = this;
	    Ext.Ajax.request({
		    url: url,
		    method : 'POST',
		    params : { multiple_data : Ext.JSON.encode(records) },
		    success : function(response) {
				gridView.fireEvent('after_grid_updated', gridView, updateType, response);
			}
		});
	}
});
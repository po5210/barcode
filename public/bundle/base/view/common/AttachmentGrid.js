Ext.define('Base.view.common.AttachmentGrid', {
	
	extend : 'Ext.grid.Panel',
	
	xtype : ['base_attachment_grid', 'attachment_grid'],
	
	title : T('title.attachments'),
	
	plugins : [ Ext.create('Ext.grid.plugin.CellEditing', {
		clicksToEdit : 1
	}) ],
	
	tbar: [{
		xtype : 'component',
		itemId : 'upload',
		html : [
		'<form accept-charset="UTF-8" class="new_attachment" enctype="multipart/form-data" id="new_attachment" method="post">',
			'<input name="utf8" type="hidden" value="&#x2713;" />',
			'<label for="attachment_path">',
			T('text.Select Files to Upload'),
			'</label>',
			'<input name="attachment[file_group_id]" type="hidden"/>',
			'<input id="attachment_path" multiple="multiple" name="attachment[path]" type="file" hidden = true, value="SELECT FILE"/>',
			'<input id="display_btn" name="btn" type="button" value = "' + T('button.file') + '" onClick = "$(\'#attachment_path\').trigger(\'click\');"/>',
		'</form>'
		]
	}, '->', { 
		xtype: 'button',
		text: T('button.delete'),
		tooltip : T('text.Remove Selected Files'),
		handler : function(){
			var grid = this.up('grid');
			var selection = grid.getSelectionModel().getSelection();
	
			Ext.Array.each(selection, function(sel) {
				sel.destroy({
					success: function() {
						grid.getSelectionModel().deselectAll();
				    },
					failure: function() {
						grid.getSelectionModel().deselectAll();
						HF.error('error.UPLOAD-FILE-FAILURE', {
							filename : data.files[0].name
						});
					}
				});
			});
		}
	}],
	

	columns : [
		{ header : T('label.id'), dataIndex : 'id', hidden : true },
		{ dataIndex : 'domain_id',  hidden : true },
		{ header : T('label.name'), width : 250, dataIndex : 'name', renderer: function (value, meta, record) {
		    return '<a href="#">' + value + '</a>';
		} },
		{ header : T('label.path'), dataIndex : 'path', hidden : true },
		{ xtype: 'numbercolumn', header : T('label.file_size'), dataIndex : 'file_size', format : '0,000', align : 'right' },
		{ header : T('label.mimetype'), dataIndex : 'mimetype' },
		{ header : T('label.creator'), dataIndex : 'creator', xtype : 'entitycolumn' },
		{ header : T('label.created_at'), width : 120, dataIndex : 'created_at', xtype : 'datecolumn', readOnly : true, format : T('format.datetime') }
	],
	viewConfig: {
	    listeners: {
	        cellclick: function (view, cell, cellIndex, record, row, rowIndex, e) {
	            var linkClicked = (e.target.tagName == 'A');
	            var clickedDataIndex =
	                view.panel.headerCt.getHeaderAtIndex(cellIndex).dataIndex;
	
	            if (linkClicked && clickedDataIndex == 'name') {
					var url = '/domains/' + login.current_domain_id + '/attachments/' + record.get('id') + '/download.json';
					HF.download(url);
	            }
	        }
	    }
	},
	
	setFileGroupId : function(id) {
		this.upload.find('input[name=attachment\\[file_group_id\\]]').val(id);
		// TODO 현재는 FileGroupId가 설정되지 않으면, 컴포넌트를 보이지 않는 것으로 함. 향후에는 FileGroupId가 없는 경우에는 자동으로 새로 만드는 것으로 하여야 함.
		this[id ? 'show' : 'hide']();
		this.getStore().proxy.setExtraParam('_q[file_group_id-eq]', id);
	},
	
	initComponent: function() {
		this.selModel = Ext.create('Ext.selection.CheckboxModel', { pruneRemoved : false, mode: 'MULTI' });
		this.store = Ext.create('Base.store.Attachment');

		this.callParent();
		
		this.on('afterrender', function() {
			//TODO Error 처리, 이름 중복등 오류시 500 에러가 발생함. - 어디서 캐치하나????
			var grid = this;
			this.upload = $(this.down('#upload').getEl().dom);
		
			this.upload.fileupload({
				url : '/domains/' + login.default_domain_id + '/attachments',
				dataType : 'json',
				add : function(e, data) {
					var store = grid.getStore();
					var file = data.files[0];
				
					if(store.find('name', file.name) > -1) {
						HF.warn(T('error.UPLOAD-SAME-FILE-EXIST', {
							filename : file.name
						}));
						return;
					}
				
					var model = store.add({
						name : file.name,
						file_size : file.size,
						mimetype : file.type
					});
				
					data.context = model[0];
				
					data.submit();
				},
				progress : function(e, data) {
					if(data.context) {
						progress = parseInt(data.loaded / data.total * 100, 10)
						data.context.set('file_size', data.loaded + '/' + data.total + '(' + progress + '%)' );
					}			
				},
				done: function (e, data) {
					data.context.set(data.result);
					data.context.commit();
		        }
			});

			this.setFileGroupId(this.fileGroupId)
		});
		
		this.on('destroy', function() {
			this.upload.fileupload('destroy');
		})
	}
});
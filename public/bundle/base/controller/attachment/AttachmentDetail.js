/**
 * AttachmentDetail controller
 */
Ext.define('Base.controller.attachment.AttachmentDetail', {
	
	extend : 'Base.abstract.entity.PopupFormController',
	
	models : ['Base.model.Attachment'],
			
	stores: ['Base.store.Attachment'],
	
	views : ['Base.view.attachment.AttachmentDetail', 'Base.view.attachment.AttachmentForm'],
	
	refs: [ { ref : 'AttachmentDetail', selector : 'base_attachment_detail' } ],
	
	init: function() {
		this.callParent(arguments);
		
		this.control({
			'base_attachment_detail' : {
				paramschange : this.onParamsChange,
				after_detail_loaded : this.afterDetailLoaded
			},
			'base_attachment_form' : {
				click_close : this.onClickClose,
				click_save :  this.onFormSave,
				after_form_saved : this.afterFormSaved,
				after_form_deleted : this.afterFormDeleted,
				validitychange: this.onFormValidityChange
			}
		});
	},
	
	/****************************************************************
	 ** 					여기는 customizing area 				   **
	 ****************************************************************/
	

	/****************************************************************
	 ** 					Override 구현 						   **
	 ****************************************************************/

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
					form.submit({});
					
					entity.save({
						success : function(record, operation) {
							var newRecord = operation.resultSet.records[0];
							form.loadRecord(newRecord);
							HF.msg.success(T('text.Success to Save'));
							formView.fireEvent('after_form_saved', form, newRecord);
						}
					});
				} else {
					// TODO 다국어
					var errorText = "Total " + errors.length + " error " + (errors.length > 1 ? "s" : "") + "occurred!\n";
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

	/****************************************************************
	 ** 					abstract method, 필수 구현 				   **
	 ****************************************************************/
	/**
	 * main view를 리턴 
	 */
	getMainView : function() {
		return this.getAttachmentDetail();
	}
});

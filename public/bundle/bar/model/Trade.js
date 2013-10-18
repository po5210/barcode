Ext.define('Bar.model.Trade', {
    
	extend: 'Ext.data.Model',
    
	fields : [
		{ name : 'id', type : 'string' },
		{ name : 'domain_id', type : 'string' },
		{ name : 'tr_cd', type : 'string' },
		{ name : 'tr_nm', type : 'string' },
		{ name : 'attr_nm', type : 'string' },
		{ name : 'tr_fg', type : 'string' },
		{ name : 'reg_nb', type : 'string' },
		{ name : 'ppl_nb', type : 'string' },
		{ name : 'ceo_nm', type : 'string' },
		{ name : 'business', type : 'string' },
		{ name : 'jongmok', type : 'string' },
		{ name : 'zip', type : 'string' },
		{ name : 'div_addr1', type : 'string' },
		{ name : 'addr2', type : 'string' },
		{ name : 'ddd', type : 'string' },
		{ name : 'tel', type : 'string' },
		{ name : 'fax', type : 'string' },
		{ name : 'tr_nmk', type : 'string' },
		{ name : 'attr_nmk', type : 'string' },
		{ name : 'ceo_nmk', type : 'string' },
		{ name : 'use_yn', type : 'string' },
		{ name : 'creator_id', type : 'string' },
		{ name : 'creator', type : 'auto' },
		{ name : 'updater_id', type : 'string' },
		{ name : 'updater', type : 'auto' },
		{ name : 'created_at', type : 'date' },
		{ name : 'updated_at', type : 'date' },
		{ name : '_cud_flag_', type : 'string' }
	],
	
  	proxy: {
		type: 'rest',
		url : '/domains/' + login.current_domain_id + '/trades',
		format : 'json',
	    reader: {
			type: 'json'
        },
        writer: {
			type: 'json'
        }
	}
});
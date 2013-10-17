Ext.define('Base.view.user.User', {
	
	extend: 'Base.abstract.entity.ListMainView',
	
 	requires : [ 
		'Base.view.user.UserSearch',
		'Base.view.user.UserList'
	],
	
	xtype : 'base_user',
		
	title : T('title.user'),
	
	searchView : 'base_user_search',
	
	gridView : 'base_user_list'

});
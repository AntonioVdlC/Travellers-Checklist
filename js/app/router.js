define(function (require){

	var $ 				= require('jquery'),
		Backbone		= require('backbone'),
		//Store			= require('app/store/websql-store'),
		HomeView 		= require('app/views/home.view'),
		CheckListView	= require('app/views/categoryList.view'),

		homeView = new HomeView({el:$('body')}),
		checkListView = null;

	return Backbone.Router.extend({

		routes: {
			'' : 'home',
			'checklist/:id': 'checkListPage',
			'checklist/:clId/category/:catId': 'categoryPage'
		},

		home: function (){
			console.log('Routing to home...');
			
			if(checkListView)
				checkListView.remove();

			homeView.render();
		},

		checkListPage: function (id) {
			console.log('Routing to CheckList Page: ' + id);
			checkListView = new CheckListView({el:$('#mainContent')});
			
			checkListView.id = id;
			//console.log(checkListView);
			checkListView.preRender();
		},

		categoryPage: function (clId, catId) {
			console.log('Routing to Category Page: ' + catId + ' from CheckList: ' + clId);
		}
	});
});
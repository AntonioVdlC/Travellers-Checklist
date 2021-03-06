define(function (require){

	var $ 				= require('jquery'),
		Backbone		= require('backbone'),
		//Store			= require('app/store/websql-store'),
		HomeView 		= require('app/views/home.view'),
		CheckListView	= require('app/views/categoryList.view'),
		CategoyView 	= require('app/views/itemList.view'),

		homeView = new HomeView({el:$('body')}),
		checkListView = null,
		categoryView = null;

	return Backbone.Router.extend({

		routes: {
			'' : 'home',
			'checklist/:id': 'checkListPage',
			'checklist/:clId/category/:catId': 'categoryPage'
		},

		home: function (){
			console.log('Routing to home...');

			$(".back-button").css("visibility", "hidden");

			homeView.render();
		},

		checkListPage: function (id) {
			console.log('Routing to CheckList Page: ' + id);

			$(".back-button").css("visibility", "visible");

			if(categoryView)
				categoryView.remove();

			if(checkListView){
				checkListView.remove();
				$('body').append('<div id="mainContent"></div>');
			}

			checkListView = new CheckListView({el:$('#mainContent'), id: id});
		},

		categoryPage: function (clId, catId) {
			console.log('Routing to Category Page: ' + catId + ' from CheckList: ' + clId);
			
			categoryView = new CategoyView({el:$('#mainContent'), id: catId, checkListId: clId});
		}
	});
});
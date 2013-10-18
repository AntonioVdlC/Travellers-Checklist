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
			
			if(checkListView)
				checkListView.remove();

			homeView.render();
		},

		checkListPage: function (id) {
			console.log('Routing to CheckList Page: ' + id);

			if(categoryView){
				categoryView.remove();
				$('body').append('<div id="mainContent"></div>');
			}

			if(checkListView){
				checkListView.remove();
				$('body').append('<div id="mainContent"></div>');
			}

			checkListView = new CheckListView({el:$('#mainContent')});
			
			checkListView.id = id;
			//console.log(checkListView);
			checkListView.preRender();
		},

		categoryPage: function (clId, catId) {
			console.log('Routing to Category Page: ' + catId + ' from CheckList: ' + clId);
			categoryView = new CategoyView({el:$('#mainContent')});

			categoryView.id = catId;
			categoryView.checkListId = clId;

			categoryView.preRender();
		}
	});
});
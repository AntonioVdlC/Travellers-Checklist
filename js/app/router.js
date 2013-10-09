define(function (require){

	var $ 			= require('jquery'),
		Backbone	= require('backbone'),
		//Store		= require('app/store/websql-store'),
		HomeView 	= require('app/views/home.view'),

		homeView = new HomeView();

	return Backbone.Router.extend({

		routes: {
			'' : 'home',
			'checklist/:id': 'checkListPage'
		},

		home: function (){
			homeView.render();
		},

		checkListPage: function (id) {
			console.log('Routing to CheckList Page: ' + id);
		}

	});
});
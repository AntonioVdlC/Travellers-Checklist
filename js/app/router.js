define(function (require){

	var $ 			= require('jquery'),
		Backbone	= require('backbone'),
		Store		= require('app/store/websql-store'),
		HomeView 	= require('app/views/home.view'),

		homeView = new HomeView();

	Store.initialize();

	return Backbone.Router.extend({

		routes: {
			'' : 'home'
		},

		home: function (){
			homeView.render();
		}
	});
});
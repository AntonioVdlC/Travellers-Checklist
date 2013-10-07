define(function (require){

	var $ 			= require('jquery'),
		Backbone	= require('backbone');

	return Backbone.Router.extend({

		routes: {
			'' : 'home'
		},

		home: function (){
			$('body').append('<p>Hello World!</p>');
		}
	});
});
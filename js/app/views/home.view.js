define(function (require){

	var $				= require('jquery'),
		_				= require('underscore'),
		Backbone		= require('backbone'),

		CheckListView	= require('app/views/checkList.view'),
		
		tpl				= require('text!tpl/homePage.html');

	return Backbone.View.extend({

		initialize: function () {
			//this.render();
		},

		render: function () {
			$('body').html(_.template(tpl));
			//this.listView = new CheckListView();
			return this;
		},

		events: {

		}
	});
});
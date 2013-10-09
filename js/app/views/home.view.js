define(function (require){

	var $				= require('jquery'),
		_				= require('underscore'),
		Backbone		= require('backbone'),
		CheckListView	= require('app/views/checkList.view'),
		tpl				= require('text!tpl/homePage.html'),

		template = _.template(tpl);

	return Backbone.View.extend({

		initialize: function () {
			//this.render();
		},

		render: function () {
			$('body').html(template());
			this.listView = new CheckListView({el:$('.scrollable')});
			return this;
		},

		events: {

		}
	});
});
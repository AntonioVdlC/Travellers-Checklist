define(function (require){

	var $				= require('jquery'),
		_				= require('underscore'),
		Backbone		= require('backbone'),
		model			= require('app/models/checkList.model'),
		tpl				= require('text!tpl/checkList.html'),
		
		template = _.template(tpl);

	return Backbone.View.extend({

		initialize: function () {
			this.collection = new model.CheckListCollection();
			this.collection.on("reset", this.render, this);
			//this.render();
		},

		render: function () {
			//console.log(this.collection.toJSON());
			this.$el.html(template({checklists: this.collection.toJSON()}));
			return this;
		},

		events: {
			
		}
	});
});
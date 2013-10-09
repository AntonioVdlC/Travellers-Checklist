define(function (require){

	var $				= require('jquery'),
		_				= require('underscore'),
		Backbone		= require('backbone'),
		Store			= require('app/store/websql-store'),
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
			console.log(this.collection.toJSON());
			this.$el.html(template({checklists: this.collection.toJSON()}));
			return this;
		},

		events: {
			'click .delete': 'deleteCheckList',
			'click .new-cl': 'newCheckList'
		},

		deleteCheckList: function (e) {
			console.log(e.currentTarget.id);

			var id = e.currentTarget.id;

			//Delete CheckList ... todo
			//Store.deleteCheckList(id);
		},

		newCheckList: function() {

		}
	});
});
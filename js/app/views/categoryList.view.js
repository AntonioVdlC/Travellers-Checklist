define(function (require){

	var $				= require('jquery'),
		_				= require('underscore'),
		Backbone		= require('backbone'),
		model			= require('app/models/categoryList.model'),
		tpl				= require('text!tpl/categoryList.html'),
		
		template = _.template(tpl);

	return Backbone.View.extend({

		initialize: function () {
			this.collection = new model.CategoryCollection();
			this.collection.on("reset", this.render, this);
			//this.render();
		},

		preRender: function () {
			this.collection.checkListId = this.id;
			this.collection.refresh();
		},

		render: function () {
			console.log(this.collection.toJSON());
			this.$el.html(template({categories: this.collection.toJSON()}));
			return this;
		},

		events: {
			'blur #add-cat-input': 'blurInput',
			'focus #add-cat-input': 'focusInput',
			'click .add-cat-button': 'addCategory',
			'click .save-model': 'saveAsModel'
		},

		blurInput: function (e) {
			if($('#add-cat-input').val() == '')
				$('#add-cat-input').val('New category...');
		},

		focusInput: function (e) {
			if($('#add-cat-input').val() == 'New category...')
				$('#add-cat-input').val('');
		},

		addCategory: function (e) {
			
		},

		saveAsModel: function (e) {
			
		}

	});
});
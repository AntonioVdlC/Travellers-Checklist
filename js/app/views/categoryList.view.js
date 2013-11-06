define(function (require){

	var $				= require('jquery'),
		_				= require('underscore'),
		Backbone		= require('backbone'),
		Store			= require('app/store/websql-store'),
		ModalPopup		= require('app/utils/modalPopup'),
		model			= require('app/models/categoryList.model'),
		tpl				= require('text!tpl/categoryList.html'),
		
		template = _.template(tpl);

	return Backbone.View.extend({

		initialize: function (opt) {
			this.collection = new model.CategoryCollection();
			this.collection.on("reset", this.render, this);

			this.id = opt.id;
			this.collection.checkListId = this.id;

			//this.render();
			this.collection.refresh();
		},

		preRender: function () {
			this.collection.checkListId = this.id;
			this.collection.refresh();
		},

		render: function () {
			//console.log(this.collection.toJSON());
			this.$el.html(template({categories: this.collection.toJSON()}));
			return this;
		},

		events: {
			'blur #add-cat-input': 'blurInput',
			'focus #add-cat-input': 'focusInput',
			'click #add-cat-button': 'addCategory',
			'click .delete-cat': 'deleteCategory',
			'click .save-model': 'saveAsModel'
		},

		blurInput: function (e) {
			if($('#add-cat-input').val() == '')
				$('#add-cat-input').val(lang.newCategory);
		},

		focusInput: function (e) {
			if($('#add-cat-input').val() == lang.newCategory)
				$('#add-cat-input').val('');
		},

		addCategory: function (e) {
			console.log('New category');

			if($('#add-cat-input').val() == '' || $('#add-cat-input').val() == lang.newCategory)
				return;

			var self = this;

			Store.addCategory(this.id, $('#add-cat-input').val(), function (){
				self.collection.refresh();
			});	
		},

		deleteCategory: function (e) {
			var self = this;
			var id = e.currentTarget.id;
			var catName = e.currentTarget.nextSibling.nextSibling.firstElementChild.innerText;

			console.log('Delete category: id = '+id+' name = '+catName);

			var delWindow = new ModalPopup(
				lang.delete+' '+lang.Category, 
				'<p>' + lang.deleteConfirmCat + lang.category + ' "' + catName + '"?</p>', 
				[lang.cancel, lang.OK],
				function (e){
					console.log('Deleting checklist...');
					Store.deleteCategory(self.id, id, function(){
						self.collection.refresh();
						delWindow.hide();
					});
				},
				{
					id: id
				}, 
				'delete-cat'
			);

			delWindow.show();
		},

		saveAsModel: function (e) {
			//console.log(e);
			//console.log($('.checkListName')[0].innerText);
			
			var self = this;
			var clName = $('.checkListName')[0].innerText;

			Store.addModel(this.id, clName, function () {
				var infoWindow = new ModalPopup(
					lang.savedAsModel, 
					'<p>' + lang.newModelSaved + ': "' + clName + '".</p>', 
					[lang.OK],
					function (){},
					{}, 
					'info'
				);

				infoWindow.show();
			});
		}

	});
});
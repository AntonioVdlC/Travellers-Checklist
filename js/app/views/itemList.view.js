define(function (require){

	var $				= require('jquery'),
		_				= require('underscore'),
		Backbone		= require('backbone'),
		Store			= require('app/store/websql-store'),
		ModalPopup		= require('app/utils/modalPopup'),
		model			= require('app/models/itemList.model'),
		tpl				= require('text!tpl/itemList.html'),
		
		template = _.template(tpl);

	return Backbone.View.extend({

		initialize: function () {
			this.collection = new model.ItemCollection();
			this.collection.on("reset", this.render, this);
			//this.render();
		},

		preRender: function () {
			this.collection.id = this.id;
			this.collection.checkListId = this.checkListId;
			this.collection.refresh();
		},

		render: function () {
			console.log(this.collection.toJSON());
			this.$el.html(template({items: this.collection.toJSON()}));
			return this;
		},

		events: {
			'blur #add-item-input': 'blurInput',
			'focus #add-item-input': 'focusInput',
			'click #add-item-button': 'addItem',
			'click .delete-item': 'deleteItem'
		},

		blurInput: function (e) {
			if($('#add-item-input').val() == '')
				$('#add-item-input').val('New item...');
		},

		focusInput: function (e) {
			if($('#add-item-input').val() == 'New item...')
				$('#add-item-input').val('');
		},

		addItem: function (e) {
			console.log('New item');

			if($('#add-item-input').val() == '' || $('#add-item-input').val() == 'New item...')
				return;

			var self = this;

			Store.addItem(this.checkListId, this.id, $('#add-item-input').val(), function (){
				self.collection.refresh();
			});	
		},

		deleteItem: function (e) {
			var self = this;
			var id = e.currentTarget.id;
			var itemName = e.currentTarget.nextElementSibling.childNodes[3].innerText;

			console.log('Delete item: id = '+id+' name = '+itemName);
			console.log(e);

			var delWindow = new ModalPopup(
				'Delete Item', 
				'<p>Are you sure you want to delete the item "' + itemName + '"?</p>', 
				['Cancel', 'OK'],
				function (e){
					console.log('Deleting item...');
					Store.deleteItem(self.checkListId, self.id, id, function(){
						self.collection.refresh();
						delWindow.hide();
					});
				},
				{
					id: id
				}, 
				'delete-item'
			);

			delWindow.show();
		}
	});
});
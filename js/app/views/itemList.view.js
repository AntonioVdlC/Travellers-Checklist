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

		initialize: function (opt) {
			this.collection = new model.ItemCollection();
			this.collection.on("reset", this.render, this);

			this.id = opt.id;
			this.checkListId = opt.checkListId;

			this.collection.id = this.id;
			this.collection.checkListId = this.checkListId;
			this.collection.refresh();

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
			'click .delete-item': 'deleteItem',
			'click .check-item': 'checkItem'
		},

		blurInput: function (e) {
			if($('#add-item-input').val() == '')
				$('#add-item-input').val(lang.newItem);
		},

		focusInput: function (e) {
			if($('#add-item-input').val() == lang.newItem)
				$('#add-item-input').val('');
		},

		addItem: function (e) {
			console.log('New item');

			if($('#add-item-input').val() == '' || $('#add-item-input').val() == lang.newItem)
				return;

			var self = this;

			Store.addItem(this.checkListId, this.id, $('#add-item-input').val(), function (){
				self.collection.refresh();
			});	
		},

		deleteItem: function (e) {
			var self = this;
			var id = e.currentTarget.id;
			var itemName = e.currentTarget.nextElementSibling.childNodes[5].innerText;
			var checked = $('input[name=check-item_'+id+']').is(':checked');

			//console.log($('input[name=check-item_'+id+']'));

			console.log('Delete item: id = '+id+' name = '+itemName+ ' checked = '+checked);
			//console.log(e);

			var delWindow = new ModalPopup(
				lang.delete+' '+lang.Item, 
				'<p>' + lang.deleteConfirmItem + lang.item + ' "' + itemName + '"?</p>', 
				[lang.cancel, lang.OK],
				function (e){
					console.log('Deleting item...');
					Store.deleteItem(self.checkListId, self.id, id, checked, function(){
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
		},

		checkItem: function (e) {
			console.log('Check Item ...');

			var self = this;
			var id = e.currentTarget.id;
			var checked = e.currentTarget.checked;

			console.log(id + ' - ' + checked);

			Store.updateItemStatus(this.checkListId, this.id, id, checked, function () {
				self.collection.refresh();
			});
		}
	});
});
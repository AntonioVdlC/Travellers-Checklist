define(function (require){

	var $				= require('jquery'),
		_				= require('underscore'),
		Backbone		= require('backbone'),
		Store			= require('app/store/websql-store'),
		ModalPopup		= require('app/utils/modalPopup'),
		NewCheckListTpl	= require('text!tpl/newCheckList.html'),
		CheckListView	= require('app/views/checkList.view'),
		tpl				= require('text!tpl/homePage.html'),

		template = _.template(tpl);

	return Backbone.View.extend({

		el: $('#mainContent'),

		initialize: function () {
			//this.render();
		},

		render: function () {
			this.$el.html(template());
			this.listView = new CheckListView({el:$('.scrollable-cl')});
			return this;
		},

		events: {
			'click .delete-cl': 'deleteCheckList',
			'click .new-cl': 'newCheckList'
		},

		deleteCheckList: function (e) {
			var self = this;
			var id = e.currentTarget.id;
			var clName = e.currentTarget.nextSibling.nextSibling.firstElementChild.innerText;

			var delWindow = new ModalPopup(
				'Delete CheckList', 
				'<p>Are you sure you want to delete the checklist "' + clName + '"?</p>', 
				['Cancel', 'OK'],
				function (e){
					console.log('Deleting checklist...');
					Store.deleteCheckList(e.data.id, function(){
						self.listView.collection.refresh();
						delWindow.hide();
					});
				},
				{
					id: id
				}, 
				'delete-cl'
			);

			delWindow.show();
		},

		newCheckList: function() {
			console.log('New CheckList');

			var self = this;

			var newWindow = new ModalPopup(
				'New CheckList',
				NewCheckListTpl,
				['Cancel', 'Create'],
				function (name, model){
					console.log('Creating new checklist: ' + name + ' - ' + model);
					Store.addCheckList(name, model, function(){
						self.listView.collection.refresh();
						newWindow.hide();
					});
				},
				{},
				'new-cl'
			);

			newWindow.show();
		}
	});
});
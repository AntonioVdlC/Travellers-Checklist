define(function (require){

	var $				= require('jquery'),
		_				= require('underscore'),
		Backbone		= require('backbone'),
		Store			= require('app/store/websql-store'),
		ModalPopup		= require('app/utils/modalPopup'),
		NewCheckListTpl	= require('text!tpl/newCheckList.html'),
		CheckListView	= require('app/views/checkList.view'),
		tpl				= require('text!tpl/homePage.html'),

		template = _.template(tpl),
		newCLTpl = _.template(NewCheckListTpl);

	return Backbone.View.extend({

		//el: $('body'),

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
				lang.delete+' '+lang.Checklist, 
				'<p>' + lang.deleteConfirm + ' ' + lang.checklist + ' "' + clName + '"?</p>', 
				[lang.cancel, lang.OK],
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
				lang.new+' '+lang.Checklist,
				newCLTpl(),
				[lang.cancel, lang.create],
				function (name, model){
					console.log('Creating new checklist: ' + name + ' - ' + model);
					if(name != '')
						Store.addCheckList(name, model, function(){
							self.listView.collection.refresh();
							newWindow.hide();
						});
					else
						return;
				},
				{},
				'new-cl'
			);

			newWindow.show();
		}
	});
});
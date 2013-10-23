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
			'click .new-cl': 'newCheckList'
		},

		newCheckList: function() {
			console.log('New CheckList');

			var self = this;

			Store.fetchModels(function (data) {
				console.log(data);
				//console.log(newCLTpl({models: data}));

				var newWindow = new ModalPopup(
					lang.new+' '+lang.Checklist,
					newCLTpl({models: data}),
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
			});
		}
	});
});
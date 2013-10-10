define(function (require){

	var $				= require('jquery'),
		_				= require('underscore'),
		Backbone		= require('backbone'),
		Store			= require('app/store/websql-store'),
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

			//Delete CheckList ... todo with PhoneGap Notification Plug-In
			var del = confirm('Are you sure you want to delete the checklist "' + clName + '"?');
			if(del == true)
				Store.deleteCheckList(id, function(){
					self.listView.collection.refresh()
				});
			else
				return;
			//Delete CheckList ... todo with PhoneGap Notification Plug-In
		},

		newCheckList: function() {
			console.log('New CheckList');

			/*var self = this;

			require(['app/store/websql-store'], function (Store){
				Store.newCheckList(function(){
					self.listView.collection.refresh();
				});
			})*/
		}
	});
});
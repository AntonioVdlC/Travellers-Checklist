define(function (require){

	var $				= require('jquery'),
		_				= require('underscore'),
		Backbone		= require('backbone'),
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
			'click .new-cl': 'newCheckList'
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
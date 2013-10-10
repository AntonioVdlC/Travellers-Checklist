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
			//console.log(this.collection.toJSON());
			this.$el.html(template({checklists: this.collection.toJSON()}));
			return this;
		},

		events: {
			'click .delete-cl': 'deleteCheckList'
		},

		deleteCheckList: function (e) {
			var self = this;
			var id = e.currentTarget.id;
			var clName = e.currentTarget.nextSibling.nextSibling.firstElementChild.innerText;

			//Delete CheckList ... todo with PhoneGap Notification Plug-In
			var del = confirm('Are you sure you want to delete the checklist "' + clName + '"?');
			if(del == true)
				Store.deleteCheckList(id, function(){
					self.collection.refresh()
				});
			else
				return;
			//Delete CheckList ... todo with PhoneGap Notification Plug-In
		}
	});
});
define(function (require){

	var $				= require('jquery'),
		_				= require('underscore'),
		Backbone		= require('backbone'),
		Store			= require('app/store/websql-store'),
		ModalPopup		= require('app/utils/modalPopup'),
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

			var delWindow = new ModalPopup(
				lang.delete+' '+lang.Checklist, 
				'<p>' + lang.deleteConfirmCL + lang.checklist + ' "' + clName + '"?</p>', 
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
		}
	});
});
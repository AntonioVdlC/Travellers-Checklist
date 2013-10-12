define(function (require) {
	
	var $			= require('jquery'),
		Backbone	= require('backbone'),
		Store		= require('app/store/websql-store'),

		Category = Backbone.Model.extend({
			
			defaults:{
				'id': 0,
				'name': 'DefaultName',
				'checkedItems': 0,
				'totalItems': 0
			},
			
			initialize: function () {
				
			}
		}),

		CategoryCollection = Backbone.Collection.extend({

			model: Category,

			initialize: function () {
				//this.refresh();
			},

			refresh: function () {
				var self = this;
				
				Store.fetchCategories(this.checkListId, function(data){
					self.reset(data);
				});
			}
		});

	return {
		Category: Category,
		CategoryCollection: CategoryCollection
	};
});
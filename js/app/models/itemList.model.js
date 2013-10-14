define(function (require) {
	
	var $			= require('jquery'),
		Backbone	= require('backbone'),
		Store		= require('app/store/websql-store'),

		Item = Backbone.Model.extend({
			
			defaults:{
				'id': 0,
				'name': 'DefaultName',
				'checked': 0,
				'checkedDate': new Date(),
				'categoryId': 0
			},
			
			initialize: function () {
				
			}
		}),

		ItemCollection = Backbone.Collection.extend({

			model: Item,

			initialize: function () {
				//this.refresh();
			},

			refresh: function () {
				var self = this;
				
				Store.fetchItems(this.checkListId, this.id, function(data){
					self.reset(data);
				});
			}
		});

	return {
		Item: Item,
		ItemCollection: ItemCollection
	};
});
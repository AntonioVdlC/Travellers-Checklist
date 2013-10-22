define(function (require) {
	
	var $			= require('jquery'),
		Backbone	= require('backbone'),
		DateParser	= require('app/utils/dateParser'),
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
					var parsedData = {};
					parsedData.array = [];
					
					parsedData.checkListId = data.checkListId;
					parsedData.categoryId = data.categoryId;
					parsedData.categoryName = data.categoryName;

					data.array.forEach(function (element, index, array) {
						parsedData.array.push({
							'id': element.id,
							'name': element.name,
							'checked': element.checked,
							'checkedDate': DateParser(element.checkedDate),
							'categoryId': element.categoryId
						});
					});
					
					self.reset(parsedData);
				});
			}
		});

	return {
		Item: Item,
		ItemCollection: ItemCollection
	};
});
define(function (require) {
	
	var $			= require('jquery'),
		Backbone	= require('backbone'),
		DateParser	= require('app/utils/dateParser'),
		Store		= require('app/store/websql-store'),

		CheckList = Backbone.Model.extend({
			
			defaults:{
				'id': 0,
				'name': 'DefaultName',
				'lastModified': new Date()
			},
			
			initialize: function () {
				
			}
		}),

		CheckListCollection = Backbone.Collection.extend({

			model: CheckList,

			initialize: function () {
				this.refresh();
			},

			refresh: function () {
				var self = this;
				
				Store.fetchCheckLists(function(data){
					var parsedData = [];

					data.forEach(function (element, index, array) {
						parsedData.push({
							'id': element.id,
							'name': element.name,
							'lastModified': DateParser(element.lastModified)
						});
					});
					
					self.reset(parsedData);
				});
			}
		});

	return {
		CheckList: CheckList,
		CheckListCollection: CheckListCollection
	};
});
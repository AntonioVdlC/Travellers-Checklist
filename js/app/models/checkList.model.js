define(function (require) {
	
	var $			= require('jquery'),
		Backbone	= require('backbone'),
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
					self.reset(data);
				});
			}
		});

	return {
		CheckList: CheckList,
		CheckListCollection: CheckListCollection
	};
});
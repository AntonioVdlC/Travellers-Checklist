define(function (require) {

	//Object function
	function WebSQLStore(){
		console.log('WebSQLStore');

		//Open DB
		this.db = openDatabase('CL_DB', '1.0', 'database', 2000000);

		return this;
	}

	//Store Initialization
	WebSQLStore.prototype.initialize = function () {
		console.log('Initializing WebSQL ...');
		
		var self = this;

		//Create CheckList Table
		this.db.transaction(
            function (tx) {
                self.createCLTable(tx);
                self.createModelTable(tx);
            },
            function (error) {self.errorHandler(error);},
            function () {console.log('Transaction success');}
        );
	};

	//Error handler
	WebSQLStore.prototype.errorHandler = function (error) {
		alert("Transation Error: " + error.message);
		console.log(error);
	};

	//Creates a table for the Models
	WebSQLStore.prototype.createModelTable = function (tx) {
		//tx.executeSql('DROP TABLE IF EXISTS model');

		var self = this;
        
        var sql = "CREATE TABLE IF NOT EXISTS model ( " +
            		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            		"name VARCHAR(50))";

        tx.executeSql(sql, null, function (tx, results) {
            console.log('Create model table success');
            console.log(results);

            self.createDefaultModel(tx);
        },
        function (tx, error) {self.errorHandler(error);});
	};

	//Adds the sample models Blank and Default
	WebSQLStore.prototype.createDefaultModel = function (tx) {
		var self = this;
		
        var sql = "INSERT OR REPLACE INTO model (id, name) VALUES (?, ?)";
        tx.executeSql(sql, [1, lang.default], function (tx, results) {

        },
    	function (tx, error) {self.errorHandler(error);});

		var sql = "CREATE TABLE IF NOT EXISTS category_model_1 ( "+
				"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
				"name VARCHAR(50), " +
				"totalItems INTEGER)";
		
		tx.executeSql(sql, null, function (tx, results) {
			
			var sql1 = "CREATE TABLE IF NOT EXISTS item_model_1 ( " +
				"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
				"name VARCHAR(50), " +
				"categoryId INTEGER)";

			tx.executeSql(sql1, null, function (tx, results) {
				self.addDefaultCategories(tx);
				self.addDefaultItems(tx);
			},
        	function (tx, error) {self.errorHandler(error);});
		},
        function (tx, error) {self.errorHandler(error);});
	};

	//Adds default categories to the Default model
	WebSQLStore.prototype.addDefaultCategories = function(tx) {
		var defaultCategories = [
        	{'id': 1, 'name': lang.electronics, 'totalItems': 7,},
        	{'id': 2, 'name': lang.clothes, 'totalItems': 13,},
        	{'id': 3, 'name': lang.toiletry, 'totalItems': 6,},
        	{'id': 4, 'name': lang.medicalKit, 'totalItems': 9,},
        	{'id': 5, 'name': lang.vaccines, 'totalItems': 12,},
        	{'id': 6, 'name': lang.paperwork, 'totalItems': 6,},
        	{'id': 7, 'name': lang.essentials, 'totalItems': 9,},
        	{'id': 8, 'name': lang.others, 'totalItems': 1,}
        ];
        var l = defaultCategories.length;
        var sql = "INSERT OR REPLACE INTO category_model_1 " +
            "(id, name, totalItems) " +
            "VALUES (?, ?, ?)";
        var cat;
        for (var i = 0; i < l; i++) {
            cat = defaultCategories[i];
            tx.executeSql(sql, [cat.id, cat.name, cat.totalItems], function (tx, results) {
                console.log('INSERT success');
            },
        	function (tx, error) {self.errorHandler(error);});
        }
	};

	//Adds default items to the Default model
	WebSQLStore.prototype.addDefaultItems = function(tx) {
		var defaultItems = [
        	{'id': 1, 'name': lang.mobile, 'categoryId': 1,},
        	{'id': 2, 'name': lang.laptop, 'categoryId': 1,},
        	{'id': 3, 'name': lang.tablet, 'categoryId': 1,},
        	{'id': 4, 'name': lang.camera, 'categoryId': 1,},
        	{'id': 5, 'name': lang.memoryCard, 'categoryId': 1,},
        	{'id': 6, 'name': lang.multiPlug, 'categoryId': 1,},
        	{'id': 7, 'name': lang.chargers, 'categoryId': 1,},

        	{'id': 8, 'name': lang.tshirts, 'categoryId': 2,},
        	{'id': 9, 'name': lang.pants, 'categoryId': 2,},
        	{'id': 10, 'name': lang.bermudas, 'categoryId': 2,},
        	{'id': 11, 'name': lang.socks, 'categoryId': 2,},
        	{'id': 12, 'name': lang.underwear, 'categoryId': 2,},
        	{'id': 13, 'name': lang.pijamas, 'categoryId': 2,},
        	{'id': 14, 'name': lang.towel, 'categoryId': 2,},
        	{'id': 15, 'name': lang.belt, 'categoryId': 2,},
        	{'id': 16, 'name': lang.shoes, 'categoryId': 2,},
        	{'id': 17, 'name': lang.swimsuit, 'categoryId': 2,},
        	{'id': 18, 'name': lang.jacket, 'categoryId': 2,},
        	{'id': 19, 'name': lang.cap, 'categoryId': 2,},
        	{'id': 20, 'name': lang.scarf, 'categoryId': 2,},

        	{'id': 21, 'name': lang.soap, 'categoryId': 3,},
        	{'id': 22, 'name': lang.shampoo, 'categoryId': 3,},
        	{'id': 23, 'name': lang.toothbrush, 'categoryId': 3,},
        	{'id': 24, 'name': lang.toothpaste, 'categoryId': 3,},
        	{'id': 25, 'name': lang.deodorant, 'categoryId': 3,},
        	{'id': 26, 'name': lang.cosmetics, 'categoryId': 3,},

        	{'id': 27, 'name': lang.antisepticCream, 'categoryId': 4,},
        	{'id': 28, 'name': lang.bandages, 'categoryId': 4,},
        	{'id': 29, 'name': lang.paracetamol, 'categoryId': 4,},
        	{'id': 30, 'name': lang.antihistaminic, 'categoryId': 4,},
        	{'id': 31, 'name': lang.phloroglucinol, 'categoryId': 4,},
        	{'id': 32, 'name': lang.antidiarrhoeal, 'categoryId': 4,},
        	{'id': 33, 'name': lang.antiemetic, 'categoryId': 4,},
        	{'id': 34, 'name': lang.laxative, 'categoryId': 4,},
        	{'id': 35, 'name': lang.firstAidKit, 'categoryId': 4,},

        	{'id': 36, 'name': lang.hepatitisA, 'categoryId': 5,},
        	{'id': 37, 'name': lang.hepatitisB, 'categoryId': 5,},
        	{'id': 38, 'name': lang.influenza, 'categoryId': 5,},
        	{'id': 39, 'name': lang.japaneseEncephalitis, 'categoryId': 5,},
        	{'id': 40, 'name': lang.poliomyelitis, 'categoryId': 5,},
        	{'id': 41, 'name': lang.rabies, 'categoryId': 5,},
        	{'id': 42, 'name': lang.yellowFever, 'categoryId': 5,},
        	{'id': 43, 'name': lang.tetanus, 'categoryId': 5,},
        	{'id': 44, 'name': lang.diphtheria, 'categoryId': 5,},
        	{'id': 45, 'name': lang.tuberculosis, 'categoryId': 5,},
        	{'id': 46, 'name': lang.typhoidFever, 'categoryId': 5,},
        	{'id': 47, 'name': lang.cholera, 'categoryId': 5,},

        	{'id': 48, 'name': lang.passport, 'categoryId': 6,},
        	{'id': 49, 'name': lang.visas, 'categoryId': 6,},
        	{'id': 50, 'name': lang.tickets, 'categoryId': 6,},
        	{'id': 51, 'name': lang.insurance, 'categoryId': 6,},
        	{'id': 52, 'name': lang.drivingLicense, 'categoryId': 6,},
        	{'id': 53, 'name': lang.photocopies, 'categoryId': 6,},

        	{'id': 54, 'name': lang.adapter, 'categoryId': 7,},
        	{'id': 55, 'name': lang.flashlight, 'categoryId': 7,},
        	{'id': 56, 'name': lang.sleepingBag, 'categoryId': 7,},
        	{'id': 57, 'name': lang.swissArmyKnife, 'categoryId': 7,},
        	{'id': 58, 'name': lang.alarmClock, 'categoryId': 7,},
        	{'id': 59, 'name': lang.compass, 'categoryId': 7,},
        	{'id': 60, 'name': lang.lighter, 'categoryId': 7,},
        	{'id': 61, 'name': lang.gourd, 'categoryId': 7,},
        	{'id': 62, 'name': lang.lock, 'categoryId': 7,},

        	{'id': 63, 'name': lang.luckyCharms, 'categoryId': 8,}
        ];
        var l = defaultItems.length;
        var sql = "INSERT OR REPLACE INTO item_model_1 " +
            "(id, name, categoryId) " +
            "VALUES (?, ?, ?)";
        var item;
        for (var i = 0; i < l; i++) {
            item = defaultItems[i];
            tx.executeSql(sql, [item.id, item.name, item.categoryId], function (tx, results) {
                console.log('INSERT success');
            },
        	function (tx, error) {self.errorHandler(error);});
        }
	};

	//Retrieves all the models from the model table
	WebSQLStore.prototype.fetchModels = function (successCallback) {
		console.log('Fetching all the models ...');

		var self = this;

		var data = [];

		this.db.transaction(
            function (tx) {

                var sql = "SELECT * FROM model";

                tx.executeSql(sql, null, function (tx, results) {
                	for(var i=0; i<results.rows.length; i++)
                		data.push(results.rows.item(i));

                	//console.log(data);
                	if(successCallback)successCallback(data);
                },
                function (tx, error) {self.errorHandler(error);});
            },
            function (error) {self.errorHandler(error);}
        );
	};

	//Adds a new model to the model table
	WebSQLStore.prototype.addModel = function (checkListId, checkListName, successCallback) {
		console.log('Saving ' + checkListName + ' as Model ...');

		var self = this;

		this.db.transaction(
			function (tx) {
				
				var sql = "INSERT OR REPLACE INTO model " +
						"(name) " +
						"VALUES (?)";

				tx.executeSql(sql, [checkListName], function (tx, results) {
					console.log('Inserting new model name into model table OK ... Creating catagory and item tables');
					
					var sql1 = "SELECT id FROM model WHERE name='" + checkListName +"'";

					tx.executeSql(sql1, null, function (tx, results) {
						console.log("New model id: " + results.rows.item(0).id);

						var modelId = results.rows.item(0).id;

						var sql2 = "CREATE TABLE IF NOT EXISTS category_model_"+ modelId +" ( " +
		            		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
		            		"name VARCHAR(50)," +
		            		"totalItems INTEGER)";

						tx.executeSql(sql2, null, function (tx, results) {
							var sql3 = "CREATE TABLE IF NOT EXISTS item_model_"+ modelId +" ( " +
			            		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
			            		"name VARCHAR(50), " +
			            		"categoryId INTEGER)";

							tx.executeSql(sql3, null, function (tx, results) {
								console.log('Tables created with success ... Populating the tables ...');
								
								self.populateModel(tx, checkListId, modelId, successCallback);
							},
							function (tx, error) {self.errorHandler(error);});
						},
						function (tx, error) {self.errorHandler(error);});
					},
					function (tx, error) {self.errorHandler(error);});	
				},
                function (tx, error) {self.errorHandler(error);});
			},
            function (error) {self.errorHandler(error);}
		);
	};

	//Populates a new model with a given checklist
	WebSQLStore.prototype.populateModel = function (tx, checkListId, modelId, successCallback) {
		console.log('Populating new model with checklist id: ' + checkListId);

		var self = this;

		var catModel = [];
		var itemModel = [];

		var sql = "SELECT * FROM category_" + checkListId;

		tx.executeSql(sql, null, function (tx, results) {

			for(var i=0; i<results.rows.length; i++)
                catModel.push(results.rows.item(i));

            console.log(catModel);

            var l = catModel.length;
	        var sql = "INSERT OR REPLACE INTO category_model_" + modelId +
	            " (id, name, totalItems) " +
	            " VALUES (?, ?, ?)";
	        var cat;
	        for (var i = 0; i < l; i++) {
	            cat = catModel[i];
	            tx.executeSql(sql, [cat.id, cat.name, cat.totalItems], function (tx, results) {
	                console.log('INSERT success');
	            },
	        	function (tx, error) {self.errorHandler(error);});
	        }

			var sql1 = "SELECT * FROM item_" + checkListId;

			tx.executeSql(sql1, null, function (tx, results) {
				for(var i=0; i<results.rows.length; i++)
                	itemModel.push(results.rows.item(i));

                console.log(itemModel);

                var l = itemModel.length;
		        var sql1 = "INSERT OR REPLACE INTO item_model_" + modelId +
		            " (id, name, categoryId) " +
		            " VALUES (?, ?, ?)";
		        var item;
		        for (var i = 0; i < l; i++) {
		            item = itemModel[i];
		            tx.executeSql(sql1, [item.id, item.name, item.categoryId], function (tx, results) {
		                console.log('INSERT success');
		            },
		        	function (tx, error) {self.errorHandler(error);});
		        }

				if(successCallback) successCallback();
			},
			function (tx, error) {self.errorHandler(error);});
		},
		function (tx, error) {self.errorHandler(error);});
	};

	//Creates a table for the CheckLists
	WebSQLStore.prototype.createCLTable = function (tx) {
		//tx.executeSql('DROP TABLE IF EXISTS checklist');

		var self = this;
        
        var sql = "CREATE TABLE IF NOT EXISTS checklist ( " +
            		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            		"name VARCHAR(50), " +
            		"lastModified DATE)";

        tx.executeSql(sql, null, function (tx, results) {
            console.log('Create checklist table success');
        },
        function (tx, error) {self.errorHandler(error);});
	};

	//Retrieve all the checklists from the checklist table
	WebSQLStore.prototype.fetchCheckLists = function (successCallback) {
		console.log('Fetching all the check lists ...');

		var self = this;

		var data = [];

		this.db.transaction(
            function (tx) {

                var sql = "SELECT * FROM checklist ORDER BY lastModified DESC";

                tx.executeSql(sql, null, function (tx, results) {
                	for(var i=0; i<results.rows.length; i++)
                		data.push(results.rows.item(i));

                	//console.log(data);
                	if(successCallback)successCallback(data);
                },
                function (tx, error) {self.errorHandler(error);});
            },
            function (error) {self.errorHandler(error);}
        );
	};

	//Delete a given checklist (id)
	WebSQLStore.prototype.deleteCheckList = function (id, successCallback) {
		console.log('Deleting checklist: id = ' + id);

		var self = this;

		this.db.transaction(
			function (tx){
				var sql = "DELETE FROM checklist WHERE id = :id";

				tx.executeSql(sql, [id], function (tx, results){
					console.log('CheckList deleted ... Droping category_ and item_ tables ...');

					var sql1 = "DROP TABLE IF EXISTS category_"+id;

					tx.executeSql(sql1, null, function (tx, results){
						
						var sql2 = "DROP TABLE IF EXISTS item_"+id;

						tx.executeSql(sql2, null, function (tx, results){
							console.log('Tables dropped ... Refreshing the collection ...');
							if(successCallback)successCallback();
						},
						function (tx, error) {self.errorHandler(error);});
					},
					function (tx, error) {self.errorHandler(error);});
				},
				function (tx, error) {self.errorHandler(error);});
			},
			function (error) {self.errorHandler(error);}
		);
	};

	//Add a new checklist to the table
	WebSQLStore.prototype.addCheckList = function (name, model, successCallback) {
		console.log('Adding new checklist: ' + name + ' - ' + model);

		var self = this;

		this.db.transaction(
			function (tx){

				var sql = "INSERT INTO checklist" +
						"(name, lastModified)"+
						"VALUES (?, ?)";

				tx.executeSql(sql, [name, new Date()], function (tx, results){
					console.log('New checklist insert success ... Creating category_ and item_ tables...');

					var sql1 = "SELECT id FROM checklist WHERE name='" + name +"'";

					tx.executeSql(sql1, null, function (tx, results) {
						console.log("New checklist id: " + results.rows.item(0).id);

						var newId = results.rows.item(0).id;

						var sql2 = "CREATE TABLE IF NOT EXISTS category_"+ newId +" ( " +
		            		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
		            		"name VARCHAR(50)," +
		            		"checkedItems INTEGER," +
		            		"totalItems INTEGER)";

						tx.executeSql(sql2, null, function (tx, results) {
							var sql3 = "CREATE TABLE IF NOT EXISTS item_"+ newId +" ( " +
			            		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
			            		"name VARCHAR(50), " +
			            		"checked INTEGER(2)," +
			            		"checkedDate DATE," +
			            		"categoryId INTEGER)";

							tx.executeSql(sql3, null, function (tx, results) {
								console.log('Tables created with success ... Refreshing the collection ...');

								if(model == 0) //Blank Model
									successCallback();

								else
									self.populateCL(tx, model, newId, successCallback);
							},
							function (tx, error) {self.errorHandler(error);});
						},
						function (tx, error) {self.errorHandler(error);});
					},
					function (tx, error) {self.errorHandler(error);});	
				},
				function (tx, error) {self.errorHandler(error);});
			},
			function (error) {self.errorHandler(error);}
		);
	};

	//Populates a new checklist with a given model
	WebSQLStore.prototype.populateCL = function (tx, model, newId, successCallback) {
		console.log('Populating new checklist with model id: ' + model);

		var catModel = [];
		var itemModel = [];

		var sql = "SELECT * FROM category_model_" + model;

		tx.executeSql(sql, null, function (tx, results) {

			for(var i=0; i<results.rows.length; i++)
                catModel.push(results.rows.item(i));

            console.log(catModel);

            var l = catModel.length;
	        var sql = "INSERT OR REPLACE INTO category_" + newId +
	            " (id, name, checkedItems, totalItems) " +
	            " VALUES (?, ?, ?, ?)";
	        var cat;
	        for (var i = 0; i < l; i++) {
	            cat = catModel[i];
	            tx.executeSql(sql, [cat.id, cat.name, 0, cat.totalItems], function (tx, results) {
	                console.log('INSERT success');
	            },
	        	function (tx, error) {self.errorHandler(error);});
	        }

			var sql1 = "SELECT * FROM item_model_" + model;

			tx.executeSql(sql1, null, function (tx, results) {
				for(var i=0; i<results.rows.length; i++)
                	itemModel.push(results.rows.item(i));

                console.log(itemModel);

                var l = itemModel.length;
		        var sql1 = "INSERT OR REPLACE INTO item_" + newId +
		            " (id, name, checked, checkedDate, categoryId) " +
		            " VALUES (?, ?, ?, ?, ?)";
		        var item;
		        for (var i = 0; i < l; i++) {
		            item = itemModel[i];
		            tx.executeSql(sql1, [item.id, item.name, 0, 0, item.categoryId], function (tx, results) {
		                console.log('INSERT success');
		            },
		        	function (tx, error) {self.errorHandler(error);});
		        }

				if(successCallback) successCallback();
			},
			function (tx, error) {self.errorHandler(error);});
		},
		function (tx, error) {self.errorHandler(error);});
	};

	//Update last modified date
	WebSQLStore.prototype.updateLastModifiedDate = function (checkListId, successCallback) {
		console.log('Updating lastModified date on checklist id = ' + checkListId + '...');

		var self = this;

		this.db.transaction(
			function (tx) {
				
				var sql = "UPDATE checklist " +
						"SET lastModified = ? " +
						"WHERE id = '" + checkListId + "'";

				tx.executeSql(sql, [new Date()], function (tx, results) {
					console.log('Last modified date updated ... Refreshing the collection ...');

					if(successCallback) successCallback();
				},
				function (tx, error) {self.errorHandler(error);});
			},
			function (error) {self.errorHandler(error);}
		);
	};

	//Retrieve all the categores from a given checklist
	WebSQLStore.prototype.fetchCategories = function (checkListId, successCallback) {
		console.log('Fetching all the categories from checklist: ' + checkListId);

		var self = this;

		var data = {};
		data.array = [];
		data.checkListId = checkListId;

		this.db.transaction(
			function (tx) {

				var sql = "SELECT name FROM checklist WHERE id='"+checkListId+"'";
				tx.executeSql(sql, null, function (tx, results) {
					console.log('Retrieving name of checklist: ' + results.rows.item(0).name);
					data.checkListName = results.rows.item(0).name;

					var sql1 = "SELECT * FROM category_"+ checkListId;
					tx.executeSql(sql1, null, function (tx, results) {
						console.log("Retrieving all info on category_"+ checkListId);

						for(var i=0; i<results.rows.length; i++)
                			data.array.push(results.rows.item(i));

                		//console.log(data);
                		if(successCallback)successCallback(data);
					},
					function (tx, error) {self.errorHandler(error);});
				},
				function (tx, error) {self.errorHandler(error);});
			},
			function (error) {self.errorHandler(error);}
		);
	};

	//Add a new category to a given checklist
	WebSQLStore.prototype.addCategory = function (checkListId, categoryName, successCallback) {
		console.log('Adding into checklist: ' + checkListId + ' category: ' + categoryName);

		var self = this;

		this.db.transaction(
			function (tx) {
				
				var sql = "INSERT INTO category_"+checkListId +
						"(name, checkedItems, totalItems)" +
						"VALUES (?, ?, ?)";

				tx.executeSql(sql, [categoryName, 0, 0], function (tx, results) {
					console.log('Added new category successfully! ...');
					//if(successCallback) successCallback();

					self.updateLastModifiedDate(checkListId, successCallback);
				},
				function (tx, error) {self.errorHandler(error);});
			},
			function (error) {self.errorHandler(error);}
		);
	};

	//Remove a category from a given checklist
	WebSQLStore.prototype.deleteCategory = function (checkListId, categoryId, successCallback) {
		console.log('Deleting category: ' + categoryId + ' from checklist: id = ' + checkListId);

		var self = this;

		this.db.transaction(
			function (tx){
				var sql = "DELETE FROM category_"+checkListId+" WHERE id = :id";

				tx.executeSql(sql, [categoryId], function (tx, results){
					console.log('Category deleted ... Deleting the items from this category ...');

					var sql1 = "DELETE FROM item_"+checkListId+" WHERE categoryId=" + categoryId;
					
					tx.executeSql(sql1, null, function (tx, results) {
						console.log('Items deleted successfully ...');

						//if(successCallback)successCallback();

						self.updateLastModifiedDate(checkListId, successCallback);
					},
					function (tx, error) {self.errorHandler(error);});
				},
				function (tx, error) {self.errorHandler(error);});
			},
			function (error) {self.errorHandler(error);}
		);
	};

	//Retrieve all the items of a given category and checklist
	WebSQLStore.prototype.fetchItems =function (checkListId, categoryId, successCallback) {
		console.log('Retrieving all the items for category ' + categoryId + ' from item_'+checkListId);

		var self = this;

		var data = {};
		data.array = [];
		data.checkListId = checkListId;
		data.categoryId = categoryId;

		this.db.transaction(
			function (tx) {

				var sql = "SELECT name FROM category_"+checkListId+" WHERE id='"+categoryId+"'";
				tx.executeSql(sql, null, function (tx, results) {
					console.log('Retrieving name of category: ' + results.rows.item(0).name);
					data.categoryName = results.rows.item(0).name;

					var sql1 = "SELECT * FROM item_"+ checkListId+" WHERE categoryId='"+categoryId+"' ORDER BY checked ASC";
					tx.executeSql(sql1, null, function (tx, results) {
						console.log("Retrieving all info on item_"+ checkListId);

						for(var i=0; i<results.rows.length; i++)
                			data.array.push(results.rows.item(i));

                		console.log(data);
                		if(successCallback)successCallback(data);
					},
					function (tx, error) {self.errorHandler(error);});
				},
				function (tx, error) {self.errorHandler(error);});
			},
			function (error) {self.errorHandler(error);}

		);
	};

	//Add a new item to a given category and checklist
	WebSQLStore.prototype.addItem = function (checkListId, categoryId, itemName, successCallback) {
		console.log('Adding into checklist: ' + checkListId + ' category: ' + categoryId + ' item: ' + itemName);

		var self = this;

		this.db.transaction(
			function (tx) {
				
				var sql = "INSERT INTO item_"+ checkListId +
						"(name, checked, checkedDate, categoryId)" +
						"VALUES (?, ?, ?, ?)";

				tx.executeSql(sql, [itemName, 0, 0, categoryId], function (tx, results) {
					console.log('Added new item successfully! ... Updating category_'+checkListId+' table ...');

					var sql1 = "UPDATE category_"+ checkListId + 
						" SET totalItems = totalItems + 1 " + 
						" WHERE id = '" + categoryId + "'";

					tx.executeSql(sql1, null, function (tx,results) {
						console.log('Updated category table ...');

						//if(successCallback) successCallback();

						self.updateLastModifiedDate(checkListId, successCallback);
					},
					function (tx, error) {self.errorHandler(error);});
				},
				function (tx, error) {self.errorHandler(error);});
			},
			function (error) {self.errorHandler(error);}
		);
	};

	//Remove an item from a given checklist
	WebSQLStore.prototype.deleteItem = function (checkListId, categoryId, itemId, checked, successCallback) {
		console.log('Deleting item: ' + itemId + ' from checklist: id = ' + checkListId + ' and category: ' + categoryId);

		var self = this;

		this.db.transaction(
			function (tx){
				var sql = "DELETE FROM item_"+checkListId+" WHERE id = :id";

				tx.executeSql(sql, [itemId], function (tx, results){
					console.log('Item deleted ... Updating the category ...');

					var sql1 = "UPDATE category_"+ checkListId + 
						" SET totalItems = totalItems - 1 " +
						" WHERE id = '" + categoryId + "'";
						
					if(checked)
						sql1 = "UPDATE category_"+ checkListId + 
							" SET totalItems = totalItems - 1 " +
								 ", checkedItems = checkedItems - 1 " + 
							" WHERE id = '" + categoryId + "'";

					tx.executeSql(sql1, null, function (tx,results) {
						console.log('Updated category table ...');
						//console.log(results);

						//if(successCallback) successCallback();

						self.updateLastModifiedDate(checkListId, successCallback);
					},
					function (tx, error) {self.errorHandler(error);});
				},
				function (tx, error) {self.errorHandler(error);});
			},
			function (error) {self.errorHandler(error);}
		);
	};

	//Check/Uncheck an item
	WebSQLStore.prototype.updateItemStatus = function (checkListId, categoryId, itemId, checked, successCallback) {
		console.log('Updating item status ...');

		var self = this;

		var itemChecked = 0;
		if(checked) itemChecked = 1;

		this.db.transaction(
			function (tx) {
				var sql = "UPDATE item_"+checkListId +
					" SET checked = " + itemChecked +
					" , checkedDate = ? "+ 
					" WHERE id = '" + itemId + "'";

				tx.executeSql(sql, [new Date()], function (tx, results) {
					console.log('Item status updated ... Updating number of checkItems in category_' + checkListId);

					var sql1 = "UPDATE category_"+ checkListId + 
						" SET checkedItems = checkedItems - 1 " + 
						" WHERE id = '" + categoryId + "'";
					if(checked)
						sql1 = "UPDATE category_"+ checkListId + 
							" SET checkedItems = checkedItems + 1 " + 
							" WHERE id = '" + categoryId + "'";

					tx.executeSql(sql1, null, function (tx, results) {
						console.log('Updated number of checkItems ...');

						//if(successCallback) successCallback();

						self.updateLastModifiedDate(checkListId, successCallback);
					},
					function (tx, error) {self.errorHandler(error);});
				},
				function (tx, error) {self.errorHandler(error);});
			},
			function (error) {self.errorHandler(error);}
		);
	};


	var store = new WebSQLStore();
	return store;
});
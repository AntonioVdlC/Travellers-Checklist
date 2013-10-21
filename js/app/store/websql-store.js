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

				tx.executeSql(sql, [id], function (tx, results){
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
								if(successCallback) successCallback();
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

				tx.executeSql(sql, [categoryId], function (tx, results){
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

					var sql1 = "SELECT * FROM item_"+ checkListId+" WHERE categoryId='"+categoryId+"'";
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

				tx.executeSql(sql, [itemId], function (tx, results){
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
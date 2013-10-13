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
                //self.addSampleData(tx); //FOR TESTING PURPOSES
            },
            function (error) {self.errorHandler(error);},
            function () {console.log('Transaction success');}
        );
	};

	//Creates a table for the CheckLists
	WebSQLStore.prototype.createCLTable = function (tx) {
		//tx.executeSql('DROP TABLE IF EXISTS checklist');

		var self = this;
        
        var sql = "CREATE TABLE IF NOT EXISTS checklist ( " +
            		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            		"name VARCHAR(50), " +
            		"lastModified DATE)";

        tx.executeSql(sql, null,
            function () {
                console.log('Create checklist table success');
            },
            function (tx, error) {self.errorHandler(error);}
        );
	};

	//Error handler
	WebSQLStore.prototype.errorHandler = function (error) {
		alert("Transation Error: " + error.message);
		console.log(error);
	};

	// DATA FOR TESTING PURPOSES
	WebSQLStore.prototype.addSampleData = function(tx) {

		var self = this;

		var checklist = [
                {"id": 0, "name": "CheckList Paris", "lastModified": new Date()},
                {"id": 1, "name": "Week-end @ London", "lastModified": new Date()},
                {"id": 2, "name": "St.Petersburg", "lastModified": new Date()},
                {"id": 3, "name": "Xmas Road Trip", "lastModified": new Date()},
                {"id": 4, "name": "Valladolid", "lastModified": new Date()}
            ];
        var l = checklist.length;
        var sql = "INSERT OR REPLACE INTO checklist " +
            "(id, name, lastModified) " +
            "VALUES (?, ?, ?)";
        var e;
        for (var i = 0; i < l; i++) {
            e = checklist[i];
            tx.executeSql(sql, [e.id, e.name, e.lastModified],
                    function() {
                        console.log('INSERT success');
                    },
                    function (tx, error) {self.errorHandler(error);});
            var sql1 = "CREATE TABLE IF NOT EXISTS category_"+ i +" ( " +
            		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            		"name VARCHAR(50))";

	        tx.executeSql(sql1, null,
	            function() {
	                console.log('Create category_'+i+' table success');
	            },
	            function (tx, error) {self.errorHandler(error);}
	        );

	        var sql2 = "CREATE TABLE IF NOT EXISTS item_"+ i +" ( " +
            		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            		"name VARCHAR(50), " +
            		"checked INTEGER(2)," +
            		"checkedDate DATE," +
            		"categoryId INTEGER)";

	        tx.executeSql(sql2, null,
	            function () {
	                console.log('Create item_'+i+' table success');
	            },
	            function (tx, error) {self.errorHandler(error);}
	        );
        }

	};

	//Retrieve all the checklists from the checklist table
	WebSQLStore.prototype.fetchCheckLists = function (successCallback) {
		console.log('Fetching all the check lists ...');

		var self = this;

		var data = [];

		this.db.transaction(
            function (tx) {

                var sql = "SELECT * FROM checklist";

                tx.executeSql(sql, [], function (tx, results) {
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

					tx.executeSql(sql1, [], function (tx, results){
						
						var sql2 = "DROP TABLE IF EXISTS item_"+id;

						tx.executeSql(sql2, [], function (tx, results){
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
					console.log('Added new category successfully! ... Refreshing the collection ...');
					if(successCallback) successCallback();
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
					console.log('Category deleted ... Refreshing the collection ...');

					//TODO Delete the items from this category
						//var sql = "DELETE FROM item_"+checkListId+" WHERE categoryId=" + categoryId;

					if(successCallback)successCallback();
				},
				function (tx, error) {self.errorHandler(error);});
			},
			function (error) {self.errorHandler(error);}
		);
	};

	//Retrieve all the items of a given category and checklist
	WebSQLStore.prototype.fetchItems =function (checkListId, categoryId, successCallback) {
		// body...
	};

	//Add a new item to a given category and checklist
	WebSQLStore.prototype.addItem = function (checkListId, categoryId, itemName, successCallback) {
		// body...
	};

	//Remove an item from a given checklist
	WebSQLStore.prototype.deleteItem = function (checkListId, itemId, successCallback) {
		// body...
	};

	//Check/Uncheck an item
	WebSQLStore.prototype.updateItemStatus = function (checkListId, itemId, successCallback) {
		// body...
	};


	var store = new WebSQLStore();
	return store;
});
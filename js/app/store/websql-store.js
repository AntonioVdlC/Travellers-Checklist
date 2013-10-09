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
            function(tx) {
                self.createCLTable(tx);
                self.addSampleData(tx); //FOR TESTING PURPOSES
            },
            function(error) {
                console.log('Transaction error: ' + error);
            },
            function() {
                console.log('Transaction success');
            }
        )
	};

	//Creates a table for the CheckLists
	WebSQLStore.prototype.createCLTable = function (tx) {
		//tx.executeSql('DROP TABLE IF EXISTS checklist');
        
        var sql = "CREATE TABLE IF NOT EXISTS checklist ( " +
            		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            		"name VARCHAR(50), " +
            		"lastModified DATE)";

        tx.executeSql(sql, null,
            function() {
                console.log('Create checklist table success');
            },
            function(tx, error) {
                alert('Create checklist table error: ' + error.message);
            }
        );
	};

	// DATA FOR TESTING PURPOSES
	WebSQLStore.prototype.addSampleData = function(tx) {
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
                    function(tx, error) {
                        alert('INSERT error: ' + error.message);
                    });
        }

	};

	//Retrieve all the checklists from the checklist table
	WebSQLStore.prototype.fetchCheckLists = function (successCallback) {
		console.log('Fetching all the check lists ...');

		var data = [];

		this.db.transaction(
            function(tx) {

                var sql = "SELECT * FROM checklist";

                tx.executeSql(sql, [], function(tx, results) {
                	for(var i=0; i<results.rows.length; i++)
                		data.push(results.rows.item(i));

                	console.log(data);
                	if(successCallback)successCallback(data);
                });
            },
            function(error) {
                alert("Transaction Error: " + error.message);
            }
        );
	};

	//Delete a given checklist (id)
	WebSQLStore.prototype.deleteCheckList = function (id) {
		// body...
	};

	//Add a new checklist to the table
	WebSQLStore.prototype.addCheckList = function () {
		// body...
	};


	var store = new WebSQLStore();
	return store;
});
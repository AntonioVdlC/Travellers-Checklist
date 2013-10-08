define(function (require) {
	
	function WebSQLStore(){
		console.log('WebSQL');
	}

	WebSQLStore.prototype.initialize = function () {
		console.log('Initializing WebSQL ...');
	};

	return new WebSQLStore();
});
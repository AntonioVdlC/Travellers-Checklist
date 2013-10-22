define(function (require){
	
	function dateParser (date) {
		var dateParsed = null;
		var dateArray = date.toString().split(" ");

		console.log(dateArray);

		dateParsed = lang[dateArray[0]] + ' ' + dateArray[2] + ' '  + lang[dateArray[1]] + ' ' + dateArray[3];

		//dateParsed = dateArray[0] + ' ' + dateArray[2] + ' '  + dateArray[1] + ' ' + dateArray[3];

		console.log(dateParsed);

		return dateParsed;
	}

	return dateParser;
});
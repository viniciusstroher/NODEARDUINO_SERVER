var fs  = require('fs');
var csv = require('ya-csv');

var writer = csv.createCsvStreamWriter(fs.createWriteStream('teste.csv'));  
writer.writeRecord(['column1', 'column2', 'column3']); 	


try{
	fs.appendFile('log_arduino.txt', log, function (err) {
		if (err) {
				// append failed
		} else {
				// done
		}
	});
	    	
}catch(ex){
			
}
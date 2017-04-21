function startServer(){
	try{
		var net = require('net');
		var fs  = require('fs');

		console.log("[Log - "+new Date().toISOString()+"]Iniciando servidor.\r\n");	

		var server = net.createServer(function(socket) {
			var connect_log = '[Log - '+new Date().toISOString()+']Conectando no servidor.\r\n';
			
			socket.write(connect_log);
	
			socket.on('data', function (data) {
				var log = '[Log - '+new Date().toISOString()+'] \n ARDUINO DATA: '+data.toString('utf8')+"\r\n";
			    console.log(log);

			    try{
					fs.appendFile('log_arduino.txt', log, function (err) {
					  if (err) {
					    // append failed
					  } else {
					    // done
					  }
					});
			    

				    /*var param = data.toString('utf8').split("#");
				    var value = param[3].split(":");

				    console.log("LIGAR LUZ ? ",value[1]);
				    if(parseInt(value[1]) == 1){
				    	this.write('liga_luz');
				    	
				    }else{
				    	this.write('desliga_luz');
				    	
				    }*/
				}catch(ex){
					console.log("ERROR SOCKET DATA");
				}
			});

			//socket.pipe(socket);
		});

		server.listen(8090);
	}catch(ex){
		console.log("RESTART SERVER");
		startServer();
	}
}
startServer();

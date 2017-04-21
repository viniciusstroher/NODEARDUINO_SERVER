function startServer(){
	try{
		var net = require('net');
		console.log("[Log]iniciando servidor");
		

		var server = net.createServer(function(socket) {
			console.log("[Log '+new date().toisostring()+']Cliente Conectado");
			
			socket.write('[Log '+new date().toisostring()+']CONNECTION ACEPTED\r\n');
	
			// Handleflg incoming messages from clients.
			socket.on('data', function (data) {
				var log = '[Log '+new date().toisostring()+'] Data Socket: '+data.toString('utf8');
			    console.log(log);
			    try{
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

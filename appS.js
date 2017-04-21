function startServer(){
	try{
		var net = require('net');
		console.log("[Log]iniciando servidor");
		var flag = true;
		var server = net.createServer(function(socket) {
			console.log("[Log]Cliente Conectado");
			
			socket.write('[Log]CONNECTION ACEPTED\r\n');
			flag = false;
			// Handleflg incoming messages from clients.
			socket.on('data', function (data) {
			    console.log('[Log]Data Socket:',data.toString('utf8'),flag);
			    try{
				    /*var param = data.toString('utf8').split("#");
				    var value = param[3].split(":");

				    console.log("LIGAR LUZ ? ",value[1]);
				    if(parseInt(value[1]) == 1){
				    	this.write('liga_luz');
				    	flag = false;
				    }else{
				    	this.write('desliga_luz');
				    	flag = true;
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

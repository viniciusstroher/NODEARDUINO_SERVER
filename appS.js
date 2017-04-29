function startServer(){
	try{
		var net = require('net');
		var fs  = require('fs');
		var jsonData = null;
		
		console.log("[Log - "+new Date().toISOString()+"]Iniciando servidor.\r\n");	

		var acaoLigaLuz = false;
		var acaoDesligaLuz = false;



		var server = net.createServer(function(socket) {
			var connect_log = '[Log - '+new Date().toISOString()+']Conectando no servidor.\r\n';
			
			socket.write(connect_log);
			
			socket.on('data', function (data) {
				try{
					if(data.toString('utf8') == 'liga_luz'){
						acaoLigaLuz = true;
					}

					if(data.toString('utf8') == 'desliga_luz'){
						acaoDesligaLuz = true;
					}
					
					if(data.toString('utf8') == 'status'){
						console.log("ENVIANDO ESTADO DO ARDUINO");
						try {
							console.log(jsonData);
						    socket.write(JSON.stringify(jsonData));
						} catch (e) {
						    console.log("not JSON");
						}
						//
						console.log(jsonData);
						//console.log("saindo");
						//process.exit();
					}


					var jsonDataAux = JSON.parse(data.toString());
					jsonData = jsonDataAux;

					if(acaoLigaLuz){
						console.log('liga_luz');
						acaoLigaLuz = false;
						socket.write('liga_luz');
						
					}

					if(acaoDesligaLuz){
						console.log('desliga_luz');
						acaoDesligaLuz = false;
						socket.write('desliga_luz');
						
					}
					
				}catch(ex){
					console.log(ex);
				}

				var log = '[Log - '+new Date().toISOString()+'] \n : '+data.toString('utf8')+"\r\n";
			    console.log(log);

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
			});

			socket.on('error', function (data) {
				console.log('error socket',data);
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

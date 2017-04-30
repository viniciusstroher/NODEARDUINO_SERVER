var ligaLuz    = false;
var desligaLuz = false;
var jsonData = null;
function startServer(){
	try{
		var net = require('net');
		var fs  = require('fs');
		
		
		console.log("[Log - "+new Date().toISOString()+"]Iniciando servidor.\r\n");	

		
		var server = net.createServer(function(socket) {
			var connect_log = '[Log - '+new Date().toISOString()+']Conectando no servidor.\r\n';
			console.log(connect_log);
			
			if(ligaLuz){
				ligaLuz = false;
				socket.write('abre_rele_luz');
				//console.log('liga_luz');
				//process.exit();
			}

			if(desligaLuz){
				desligaLuz = false;
				socket.write('fecha_rele_luz');
				//console.log('desliga_luz');
				//process.exit();
			}
			
			socket.on('data', function (data) {
				console.log(data.toString());
				try{
					
					var jsonDataAux = JSON.parse(data.toString());

					jsonData = jsonDataAux;

								
				}catch(ex){
					//console.log(ex);
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


var express = require('express');
var app = express();

app.get('/liga_luz', function(req, res) {
	ligaLuz = true;
    res.send({enviando_comando : true});
});
app.get('/desliga_luz', function(req, res) {
	desligaLuz = true;
    res.send({enviando_comando : true});
});

app.get('/status', function(req, res) {
    res.send(jsonData);

});


app.listen(80);
console.log('API MOBILE RODANDO NA 80.');
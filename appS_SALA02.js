var jsonData = null;
var portaWS = 8091;
var portaAPI = 81;
var lugar = "Sala_02";




function startServer(){
	try{
		var net = require('net');
		var fs  = require('fs');
		var csv = require('ya-csv');
		console.log("[Log - "+new Date().toISOString()+"]Iniciando servidor (Coleta de Voltagem - "+lugar+").\r\n");	
		
		var server = net.createServer(function(socket) {
			var connect_log = '[Log - '+new Date().toISOString()+']Conectando no servidor.\r\n';
			console.log(connect_log);
			
			socket.on('data', function (data) {
				
				try{
					
					var jsonDataAux = JSON.parse(data.toString());
					jsonData = jsonDataAux;
					//console.log(data.toString());	
					
					try{
				    	
						var writer = csv.createCsvStreamWriter(fs.createWriteStream(lugar+'.csv'));  
						writer.writeRecord([new Date().toISOString(), jsonData.corrente]); 
				    	
					}catch(ex){
						
					}	
				}catch(ex){
					//console.log(ex);
				}

				var log = '[Log - '+new Date().toISOString()+'] \n : '+data.toString('utf8')+"\r\n";
			    //console.log(log);


			});

			socket.on('error', function (data) {
				console.log('error socket',data);
			});
			//socket.pipe(socket);
		});

		server.listen(portaWS);

	}catch(ex){
		console.log("RESTART SERVER VOLTAGEM 1");
		startServer();
	}
}
startServer();


var express = require('express');
var app = express();

	app.use(function (req, res, next) {

	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});

app.get('/corrente', function(req, res) {
	
    res.send({corrente : jsonData.corrente});
});

app.listen(portaAPI);
console.log('API MOBILE RODANDO NA '+portaAPI+'.');
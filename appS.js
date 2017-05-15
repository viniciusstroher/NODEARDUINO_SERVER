var ligaLuz    = false;
var desligaLuz = false;

var ligaLuz2    = false;
var desligaLuz2 = false;

var ligaLuz3    = false;
var desligaLuz3 = false;


var jsonData = null;
function startServer(){
	try{
		var csv = require('ya-csv');
		var net = require('net');
		var fs  = require('fs');
		
		
		console.log("[Log - "+new Date().toISOString()+"]Iniciando servidor.\r\n");	

		
		var server = net.createServer(function(socket) {
			var connect_log = '[Log - '+new Date().toISOString()+']Conectando no servidor.\r\n';
			console.log(connect_log);
			
			if(ligaLuz){
				ligaLuz = false;
				socket.write('abre_rele_luz1');
				//console.log('liga_luz');
				//process.exit();
			}

			if(desligaLuz){
				desligaLuz = false;
				socket.write('fecha_rele_luz1');
				//console.log('desliga_luz');
				//process.exit();
			}

			if(ligaLuz2){
				ligaLuz2 = false;
				socket.write('abre_rele_luz2');
				//console.log('liga_luz');
				//process.exit();
			}

			if(desligaLuz2){
				desligaLuz2 = false;
				socket.write('fecha_rele_luz2');
				//console.log('desliga_luz');
				//process.exit();
			}

			if(ligaLuz3){
				ligaLuz3 = false;
				socket.write('abre_rele_luz3');
				//console.log('liga_luz');
				//process.exit();
			}

			if(desligaLuz3){
				desligaLuz3 = false;
				socket.write('fecha_rele_luz3');
				//console.log('desliga_luz');
				//process.exit();
			}
			
			socket.on('data', function (data) {
				console.log(data.toString());
				try{
					
					var jsonDataAux = JSON.parse(data.toString());

					jsonData = jsonDataAux;

					var writer = csv.createCsvStreamWriter(fs.createWriteStream('mestre.csv'));  
					writer.writeRecord(['column1', 'column2', 'column3']); 	

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

app.get('/liga_luz', function(req, res) {
	ligaLuz = true;
    res.send({enviando_comando : true});
});

app.get('/desliga_luz', function(req, res) {
	desligaLuz = true;
    res.send({enviando_comando : true});
});


app.get('/liga_luz2', function(req, res) {
	ligaLuz2 = true;
    res.send({enviando_comando : true});
});

app.get('/desliga_luz2', function(req, res) {
	desligaLuz2 = true;
    res.send({enviando_comando : true});
});

app.get('/liga_luz3', function(req, res) {
	ligaLuz3 = true;
    res.send({enviando_comando : true});
});

app.get('/desliga_luz3', function(req, res) {
	desligaLuz3 = true;
    res.send({enviando_comando : true});
});



app.get('/status', function(req, res) {
    res.send(jsonData);

});


app.listen(80);
console.log('API MOBILE RODANDO NA 80.');
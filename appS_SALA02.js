var jsonData = null;
var portaWS = 8092;
var portaAPI = 82;
var lugar = "Sala_02";

var data_hoje = '';
var hora_hoje = '';
var net = require('net');
var fs  = require('fs');

var contagem_csv = 60000;
var contagem_csv_contando = false;

function startServer(){
	try{

		console.log("[Log - "+new Date().toISOString()+"]Iniciando servidor (Coleta de Voltagem - "+lugar+").\r\n");	
		
		var server = net.createServer(function(socket) {
			var connect_log = '[Log - '+new Date().toISOString()+']Conectando no servidor.\r\n';
			console.log(connect_log);
			
			socket.on('data', function (data) {
				
				try{
					
					var jsonDataAux = JSON.parse(data.toString());
					jsonData = jsonDataAux;
					jsonData.corrente = Math.round(jsonData.corrente);
					

					
					if(!contagem_csv_contando){
						var contagem_csv_contando = true;
						
						var dataObj = new Date();
						data_hoje = (dataObj.getMonth()+1)+"/"+dataObj.getDate();
						hora_hoje = dataObj.getHours()+":"+dataObj.getMinutes();

						setTimeout(function(){
							var contagem_csv_contando = false;
							var head = [data_hoje,hora_hoje, jsonData.corrente,Math.round(parseFloat(jsonData.corrente)*220)].join(";")+"\n";	
			
							try{
								fs.appendFile('/home/pi/NODEARDUINO_SERVER/'+lugar+'.csv', head, function (err) {});   	
							}catch(ex){
								console.log(ex);		
							}
						},contagem_csv);
					}
				}catch(ex){
					//console.log(ex);
				}

			});

			socket.on('error', function (data) {
				console.log('error socket',data);
			});
			
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
	if(jsonData == null){
		jsonData = {};
		jsonData.corrente = 0;
	}
	
    res.send({corrente : jsonData.hasOwnProperty('corrente') ? jsonData.corrente : 0 , data:data_hoje, hora:hora_hoje});
});

app.get('/contagem_csv', function(req, res) {
	try{
		contagem_csv = parseInt(req.query.valor);
		res.send({retorno: 'valor alterado '+contagem_csv+' @ '+req.query.valor+'.'});
	}catch(ex){
		 res.send({retorno: 'valor nao alterado.'});
	}
});

app.listen(portaAPI);
console.log('API MOBILE RODANDO NA '+portaAPI+'.');
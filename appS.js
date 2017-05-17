var ligaLuz    = false;
var desligaLuz = false;

var ligaLuz2    = false;
var desligaLuz2 = false;

var ligaLuz3    = false;
var desligaLuz3 = false;

var ligaArCondicionado = false;
var ligarProjetor 	   = false;

var jsonData = null;

var net = require('net');
var fs  = require('fs');

var data_hoje = '';
var hora_hoje = '';

var processando_pir = false;
var pir_1 			= 0;
var pir_2 			= 0;

var regraShutdown   = false;
var upAll 			= false;

var ldr1Corte = 200;
var ldt2Corte = 600;

var head = ['dia','hora', 'luminosidade 1', 'luminosidade 2', 'pir 1' , 'pir 2','temperatura 1', 'temperatura 2'].join(";")+"\n";	
try{
	fs.appendFile('mestre.csv', head, function (err) {
		if (err) {
				// append failed
		} else {
				// done
		}
	});
	    	
}catch(ex){
			
}

function startServer(){
	try{
		
		console.log("[Log - "+new Date().toISOString()+"]Iniciando servidor.\r\n");	
		
		var server = net.createServer(function(socket) {
			var connect_log = '[Log - '+new Date().toISOString()+']Conectando no servidor.\r\n';
			console.log(connect_log);
			
			if(regraShutdown){
				regraShutdown = false;
				socket.write('shutdown_relays');
			}

			if(upAll){
				upAll = false;
				socket.write('up_app_relays');
			}


			if(ligaArCondicionado){
				ligaArCondicionado = false;
				socket.write('liga_ar_condicionado');
				//console.log('liga_luz');
				//process.exit();
			}

			if(ligarProjetor){
				ligarProjetor = false;
				socket.write('liga_projetor');
				//console.log('liga_luz');
				//process.exit();
			}


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
					
					pir_1 = jsonData.movimentacao;
					pir_2 = jsonData.movimentacao2;
					//REGRA SHUTDOWN
					if(!processando_pir){
						processando_pir = true;
						setTimeout(function(){
							
							if(pir_1 == 0 && pir_2 == 0){
								console.log('regra shutdown ',pir_1,pir_2);
								try{
									if(jsonData.luminosidade > ldr1Corte && jsonData.luminosidade2 > ldt2Corte){
										regraShutdown = true;
									}
								}catch(ex){
									upAll = true;
								}
								
							}else{
								if(jsonData.luminosidade > ldr1Corte && jsonData.luminosidade2 > ldt2Corte){
										regraShutdown = true;
								}else{
									upAll = true;
								}
							}


						},6000);
					}
					//regra shutdown
					var dataObj = new Date();
					
					data_hoje = (dataObj.getMonth()+1)+"/"+dataObj.getDate();
					hora_hoje = dataObj.getHours()+":"+dataObj.getMinutes();

					var row = [data_hoje,hora_hoje, jsonData.luminosidade, jsonData.luminosidade2, jsonData.movimentacao, jsonData.movimentacao2,jsonData.temperatura, jsonData.temperatura2].join(";")+"\n"; 	

					try{
						fs.appendFile('mestre.csv', row, function (err) {
							if (err) {
									// append failed
							} else {
									// done
							}
						});
						    	
					}catch(ex){
								
					}

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

app.get('/liga_ar_condicionado', function(req, res) {
	ligaArCondicionado = true;
    res.send({enviando_comando : true});
});

app.get('/liga_projetor', function(req, res) {
	ligarProjetor = true;
    res.send({enviando_comando : true});
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
	if(jsonData !== null){
		jsonData.data = data_hoje;
		jsonData.hora = hora_hoje;
	}
    res.send(jsonData);

});


app.get('/ldr1', function(req, res) {
	try{
		ldr1Corte = req.query.valor;
		res.send({retorno: 'valor alterado '+ldr1Corte+'.'});
	}catch(ex){
		 res.send({retorno: 'valor nao alterado.'});
	}
});

app.get('/ldr2', function(req, res) {
	try{
		ldr2Corte = req.query.valor;
		res.send({retorno: 'valor alterado '+ldr2Corte+'.'});
	}catch(ex){
		 res.send({retorno: 'valor nao alterado.'});
	}
});


app.listen(80);
console.log('API MOBILE RODANDO NA 80.');
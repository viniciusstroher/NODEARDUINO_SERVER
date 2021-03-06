var net = require('net');
var fs  = require('fs');
var os  = require('os');

var ligaLuz    = false;
var desligaLuz = false;

var ligaLuz2    = false;
var desligaLuz2 = false;

var ligaLuz3    = false;
var desligaLuz3 = false;

var ligaArCondicionado = false;
var ligarProjetor 	   = false;

var jsonData = null;

var data_hoje = '';
var hora_hoje = '';

var processando_pir = false;
var pir_1 			= 0;
var pir_2 			= 0;

var regraShutdown   = false;
var upAll 			= false;

var ldr1Corte = 200;
var ldt2Corte = 600;

var ms = 6000;
var amostras = 6;

var ldr1_fator = 0.6875;
var ldr2_fator = 0.1930;

var sem_presenca = 0;

var dataObj = new Date();					
data_hoje = (dataObj.getMonth()+1)+"/"+dataObj.getDate();
hora_hoje = dataObj.getHours()+":"+dataObj.getMinutes();

var contagem_csv = 30000;
var contagem_csv_contando = false;

var pir_mode = false;
var pir_mode_processando = false;
var pir_re_armar = 60000;

function startServer(){
	try{
		
		console.log("[Log - "+new Date().toISOString()+"]Iniciando servidor.\r\n");	
		
		var server = net.createServer(function(socket) {
			var connect_log = '[Log - '+new Date().toISOString()+']Conectando no servidor.\r\n';
			//console.log(connect_log);
			
			if(regraShutdown){
				console.log('shutdown_relays');
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
			
			}

			if(ligarProjetor){
				ligarProjetor = false;
				socket.write('liga_projetor');
			
			}


			if(ligaLuz){
				ligaLuz = false;
				socket.write('abre_rele_luz1');
	
			}

			if(desligaLuz){
				desligaLuz = false;
				socket.write('fecha_rele_luz1');
		
			}

			if(ligaLuz2){
				ligaLuz2 = false;
				socket.write('abre_rele_luz2');
	
			}

			if(desligaLuz2){
				desligaLuz2 = false;
				socket.write('fecha_rele_luz2');

			}

			if(ligaLuz3){
				ligaLuz3 = false;
				socket.write('abre_rele_luz3');

			}

			if(desligaLuz3){
				desligaLuz3 = false;
				socket.write('fecha_rele_luz3');

			}
			
			socket.on('data', function (data) {
				console.log(new Date().toISOString(),data.toString());
				try{
					
					var jsonDataAux = JSON.parse(data.toString());

					jsonData = jsonDataAux;
					//FATOR DE CORRECAO
					jsonData.luminosidade  = parseFloat(parseFloat(jsonData.luminosidade).toFixed(2)  * parseFloat(ldr1_fator).toFixed(2)).toFixed(2); 
					jsonData.luminosidade2 = parseFloat(parseFloat(jsonData.luminosidade2).toFixed(2) * parseFloat(ldr2_fator).toFixed(2)).toFixed(2); 
					
					pir_1 = jsonData.movimentacao;
					pir_2 = jsonData.movimentacao2;

					//REGRA SHUTDOWN
					console.log('pir_mode',pir_mode);
					if(pir_mode){
						if(!pir_mode_processando){
							pir_mode_processando = true;
							setTimeout(function(){
								console.log('pir_mode desligado');
								pir_mode_processando = false;
								pir_mode = false;
							},pir_re_armar);
						}
					}else{
						if(!processando_pir){
							processando_pir = true;
							
							setTimeout(function(){
								try{
									console.log('Fator',ldr1_fator,ldr2_fator);
									console.log('PIRS',pir_1,pir_2);

									if(pir_1 == 0 && pir_2 == 0){
										sem_presenca +=1;
										console.log('sem_presenca:',sem_presenca+' de '+amostras);
								
										if(sem_presenca > amostras){
											sem_presenca = 0;
											regraShutdown = true;
											console.log("###### regraShutdown",regraShutdown,'Luminosidade',jsonData.luminosidade +">"+ldr1Corte,'Luminosidade2',jsonData.luminosidade2+">"+ldt2Corte);
										}
									}else{
										if(parseFloat(jsonData.luminosidade) > parseFloat(ldr1Corte) &&  parseFloat(jsonData.luminosidade2) > parseFloat(ldt2Corte)){
												regraShutdown = true;
												console.log("###### regraShutdown",regraShutdown,'Luminosidade',jsonData.luminosidade +">"+ldr1Corte ,'Luminosidade2',jsonData.luminosidade2 +">"+ldt2Corte);
										}else{
											upAll = true;
											console.log("###### upAll",upAll,'Luminosidade',jsonData.luminosidade+">"+ldr1Corte,'Luminosidade2',jsonData.luminosidade2+">"+ldt2Corte);			
										}
										sem_presenca = 0;
									}
									
									processando_pir = false;
								}catch(ex){
									console.log('try pir on err:',ex);
									processando_pir = false;
									
								}
							},ms);
							
						}
					}

					//regra shutdown

					if(!contagem_csv_contando){
						contagem_csv_contando = true;
						
						setTimeout(function(){
							contagem_csv_contando = false;

							var dataObj = new Date();
							data_hoje = (dataObj.getMonth()+1)+"/"+dataObj.getDate();
							hora_hoje = dataObj.getHours()+":"+dataObj.getMinutes();

							var row = [data_hoje,
									  hora_hoje, 
									  jsonData.luminosidade, 
									  jsonData.luminosidade2, 
									  jsonData.movimentacao, 
									  jsonData.movimentacao2,
									  jsonData.temperatura, 
									  jsonData.temperatura2].join(";")+"\n"; 	

							try{
								if(os.platform() != "win32"){
									fs.appendFile('/home/pi/NODEARDUINO_SERVER/mestre.csv', row, function (err) {});    	
								}else{
									fs.appendFile('mestre.csv', row, function (err) {});    	
								}
							}catch(ex){
										
							}
						},contagem_csv);
					}
				}catch(ex){
					console.log(ex);
				}

			});

			socket.on('error', function (data) {
				console.log('error socket',data);
			});
			
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
	}else{
		
		jsonData = {};
		jsonData.data = data_hoje;
		jsonData.hora = hora_hoje;
	}
    res.send(jsonData);

});


app.get('/ldr1', function(req, res) {
	try{
		ldr1Corte = parseInt(req.query.valor);
		res.send({retorno: 'valor alterado '+ldr1Corte+' @ '+req.query.valor+'.'});
	}catch(ex){
		 res.send({retorno: 'valor nao alterado.'});
	}
});

app.get('/ldr2', function(req, res) {
	try{
		ldt2Corte = parseInt(req.query.valor);
		res.send({retorno: 'valor alterado '+ldt2Corte+' @ '+req.query.valor+'.'});
	}catch(ex){
		 res.send({retorno: 'valor nao alterado.'});
	}
});

app.get('/ms', function(req, res) {
	try{
		ms = parseInt(req.query.valor);
		res.send({retorno: 'valor alterado '+ms+' @ '+req.query.valor+'.'});
	}catch(ex){
		 res.send({retorno: 'valor nao alterado.'});
	}
});

app.get('/amostras', function(req, res) {
	try{
		amostras = parseInt(req.query.valor);
		res.send({retorno: 'valor alterado '+amostras+' @ '+req.query.valor+'.'});
	}catch(ex){
		 res.send({retorno: 'valor nao alterado.'});
	}
});

app.get('/ldr1_fator', function(req, res) {
	try{
		ldr1_fator = parseFloat(req.query.valor);
		res.send({retorno: 'valor alterado '+ldr1_fator+' @ '+req.query.valor+'.'});
	}catch(ex){
		 res.send({retorno: 'valor nao alterado.'});
	}
});

app.get('/ldr2_fator', function(req, res) {
	try{
		ldr2_fator = parseFloat(req.query.valor);
		res.send({retorno: 'valor alterado '+ldr1_fator+' @ '+req.query.valor+'.'});
	}catch(ex){
		 res.send({retorno: 'valor nao alterado.'});
	}
});

app.get('/contagem_csv', function(req, res) {
	try{
		contagem_csv = parseInt(req.query.valor);
		console.log(contagem_csv);
		res.send({retorno: 'valor alterado '+contagem_csv+' @ '+req.query.valor+'.'});
	}catch(ex){
		 res.send({retorno: 'valor nao alterado.'});
	}
});

app.get('/pir_mode', function(req, res) {
	try{
		
		pir_mode = (req.query.valor == 'true');
		res.send({retorno: 'valor alterado '+pir_mode+' @ '+req.query.valor+'.'});
	}catch(ex){
		 res.send({retorno: 'valor nao alterado.'});
	}
});

app.get('/pir_re_armar', function(req, res) {
	try{
		pir_re_armar = parseInt(req.query.valor);
		res.send({retorno: 'valor alterado '+pir_re_armar+' @ '+req.query.valor+'.'});
	}catch(ex){
		 res.send({retorno: 'valor nao alterado.'});
	}
});






app.listen(80);
console.log('API MOBILE RODANDO NA 80.');
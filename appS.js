function startServer(){
	try{
		var net = require('net');
		var fs  = require('fs');
		var jsonData = null;

		console.log("[Log - "+new Date().toISOString()+"]Iniciando servidor.\r\n");	

		var server = net.createServer(function(socket) {
			var connect_log = '[Log - '+new Date().toISOString()+']Conectando no servidor.\r\n';
			
			socket.write(connect_log);
	
			socket.on('data', function (data) {
				try{
					jsonData = JSON.parse(data.toString('utf8'));
				}catch(ex){

				}

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
			    	
					console.log(jsonData);
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
					socket.destroy();
				}
			});
			socket.on('error', function (data) {
				console.log('error socket',data);
				
			});
			//socket.pipe(socket);
		});

		server.listen(8090);

		var app = require('http').createServer(handler)
		var io = require('socket.io')(app);
		
		app.listen(8091);

		function handler (req, res) {
		  fs.readFile(__dirname + '/index.html',
		  function (err, data) {
		    if (err) {
		      res.writeHead(500);
		      return res.end('Error loading index.html');
		    }

		    res.writeHead(200);
		    res.end(data);
		  });
		}

		io.on('connection', function (socket) {
		  socket.emit('news', { hello: 'world' });
		  socket.on('my other event', function (data) {
		    console.log(data);
		  });
		});
		
	}catch(ex){
		console.log("RESTART SERVER");
		startServer();
	}
}
startServer();

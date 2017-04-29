var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var net = require('net');
app.listen(8091);

function handler (req, res) {
  res.writeHead(500);
}
var host = '127.0.0.1';

/*
io.on('connection', function (socket) {
 
  socket.emit('connectado', { conectado: true });

  socket.on('status', function (data) {
  	console.log("Conectando no midleware.");
  	
	//socket.emit('status', { jsonData: null });		    
  });
});


*/
var client = new net.Socket();
client.connect(8090, host, function() {
console.log('Conectado no midleware.');
//client.write('init');
//client.write('status');
//
//client.write('desliga_luz');
client.write('liga_luz');
client.destroy(); 
throw 'comando enviado';

});
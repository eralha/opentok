var express = require('express');
var port = process.env.PORT || 3000;
var app = express();
var server = require('http');
var path = require('path');

app.server = server.createServer(app);

var socket = require('./socket')(app.server);

app.get('/', function(request, response) {
    response.sendFile(path.resolve(__dirname + '/../www/index.html'));
});

app.get('/app-auth/', function(request, response) {
    response.sendFile(path.resolve(__dirname + '/../www/auth.json'));
});

app.use('/js', express.static(__dirname + '/../www/js'));
app.use('/images', express.static(__dirname + '/../www/images'));

app.server.listen(port, function () {
  console.log('Example app listening on port '+port);
});


module.exports = function (server) {

	var io = require('socket.io')(server);

	var OpenTok = require('opentok'),
    	opentok = new OpenTok('45923912', 'f8e922c1b033e9f83002f51e0d40667f39ec2624');
	var sessionIds = new Array();


	var rtc = io.of('/rtc').on('connection', function (socket) {

		/*
			console.log('---------------------------------');
			for(i in rtc.connected){
				if(socket.id == rtc.connected[i].id){ console.log('socket found', rtc.connected[i].id); }
				console.log(rtc.connected[i].id);
			}
		*/

		  socket.on('disconnect', function() {
		  	rtc.emit('roomList', rtc.adapter.rooms);
		  });

		  socket.on('joinRoom', function (room) {
		  	socket.emit('msg', 'room joined');
		  	socket.join(room);
		  });

		  socket.on('leaveRoom', function (room) {
		  	socket.emit('msg', 'room leaved');
		  	socket.leave(room);
		  });

		  socket.on('emitRoom', function (data) {
		  	//console.log(data, rtc.adapter.rooms);
		  	//console.log('room emit', data);
		  	data.id = socket.client.id;
		  	rtc.to(data.room).emit(data.room, data);
		  });

		  socket.on('getRooms', function (data) {
		  	rtc.emit('roomList', rtc.adapter.rooms);
		  });

		  socket.on('leaveAllRooms', function (data) {
		  	if(socket._joinedRoom){
		  		socket.leave(socket._joinedRoom);
		  		socket._joinedRoom = undefined;
		  		rtc.emit('roomList', rtc.adapter.rooms);
		  	}
		  });

		  socket.on('emit', function (data) {

		  	//console.log(data);
		  	if(data.action == 'createSession'){
		  		opentok.createSession({mediaMode:"routed"}, function(error, session) {
				  if (error) {
				    console.log("Error creating session:", error);
				  } else {
				    sessionId = session.sessionId;
				    sessionIds.push(sessionId);

				    //console.log("Session ID: " + sessionId);

				    //  Use the role value appropriate for the user:
				    var tokenOptions = {};
					    tokenOptions.role = "publisher";
					    tokenOptions.data = "username="+Math.random()*100;

				    // Generate a token.
				    var token = opentok.generateToken(sessionId, tokenOptions);
				    //console.log(token);


				    //Se o Socket já estiver noutra sala de conversa remove dessa mesma Sala
				    if(socket._joinedRoom){
				    	socket.leave(socket._joinedRoom);
				    }

				    socket.join(sessionId);
				    socket._joinedRoom = sessionId;
				    socket.emit('sessionCreation', { id: sessionId, token: token });

				    //Emite a todos os users ligados ao server a nova sala disponivel
				    rtc.emit('roomList', rtc.adapter.rooms);
				  }
				});

		  	}//END IF ACTION

		  	if(data.action == 'joinSession'){
		  		var tokenOptions = {};
					    tokenOptions.role = "subscriber";
					    tokenOptions.data = "username="+Math.random()*100;

		  		var token = opentok.generateToken(data.sessionId, tokenOptions);
			    console.log(token);

			    socket.emit('tokenCreation', { id: sessionId, token: token });
		  	}

		  });

		  //emit welcome message
		  //socket.emit('msg', { connected: 1 });
		  rtc.emit('roomList', rtc.adapter.rooms);

	});

}
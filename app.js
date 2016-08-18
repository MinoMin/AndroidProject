var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nodemailer = require("nodemailer");
var mysql = require('mysql');
var session = require('express-session');




var routes = require('./routes/index');
var users = require('./routes/users');

server.listen(3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);






// 메일 서버 로그인  
var transporter = nodemailer.createTransport({
    service: 'Gmail', auth: { 
      user: 'hmh0858', 
      pass: 'gjalsgh1' }
});


// 요청오면 메일보내기
app.get('/send',function(req,res){
var mailOptions = {
    from: 'ddd',
    to: 'hmh0858@nate.com',
    subject: "고정제목",
    text: '흠',
    html: req.query.text
};

transporter.sendMail(mailOptions, function(error, info){
    if (error){
        // 메일 발송 오류
        console.log(error);
        //result.resCode = resCode.FAILED;
    } else {
        // 메일 발송 성공
        console.log("Message sent : " + info.response);
        res.end("sent");
        //result.resCode = resCode.SUCCESS;
    }
    transporter.close();
   // header.sendJSON(result, res);
});  
});


// 이메일 중복 체크 
app.post('/checkemail',function(req,res){
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'kitri',
  database : 'project'
});

connection.connect();
var email = req.body.email;
connection.query('SELECT email from nodeuser', function(err, rows, fields) {
  if (!err){    
var a = 0;
for(var i = 0; i<rows.length; i++){

  if(rows[i].email==email){

    a = 1;
     console.log('1로 변했어');
    break;

  }else{
    a=0;
    console.log('0으로 변했어');

  }
}

if(a==1){

  res.end("no")
  console.log('1로 변해서 보냈어');
}else{
  res.end("ok")
  console.log('0으로 변해서 보냈어');
}

}else{
    console.log('Error while performing Query.');
  }
});
connection.end();
});




// 닉네임 중복 체크 
app.post('/checknickname',function(req,res){
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'kitri',
  database : 'project'
});

connection.connect();
var nickname = req.body.nickname;
connection.query('SELECT nickname from nodeuser', function(err, rows, fields) {
  if (!err){    
var a = 0;
for(var i = 0; i<rows.length; i++){

  if(rows[i].nickname==nickname){

    a = 1;
     console.log('1로 변했어');
    break;

  }else{
    a=0;
    console.log('0으로 변했어');

  }
}

if(a==1){

  res.end("no")
  console.log('1로 변해서 보냈어');
}else{
  res.end("ok")
  console.log('0으로 변해서 보냈어');
}

}else{
    console.log('Error while performing Query.');
  }
});
connection.end();
});






// 회원정보 가입하며 넣기

app.post('/singupuser',function(req,res){
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'kitri',
  database : 'project'
});

connection.connect();

var user = {'email':req.body.email, 'password': req.body.password, 'nickname':req.body.nickname};

connection.query('insert into nodeuser set ?', user, function(err, rows, fields) {
  if (!err){    
  res.end("ok")
}else{
    console.log('Error while performing Query.');
  }
});
connection.end();
});
























// 여기서부터 두영이 채팅

var usernames = {};
// rooms which are currently available in chat
//var rooms = ['INDEX','room1','room2','room3'];
var rooms = [];

io.sockets.on('connection', function (socket) {

 






  // when the client emits 'adduser', this listens and executes
    socket.on('adduser', function(username){
    // store the username in the socket session for this client
    socket.username = username;
    // store the room name in the socket session for this client
  //  socket.room = 'INDEX';
    // add the client's username to7 the global list
    usernames[username] = username;
    // send client to room 1
  //  socket.join('INDEX');
    // echo to client they've connected
  //  socket.emit('updatechat', 'SERVER', 'you have connected to room1');
    // echo to room 1 that a person has connected to their room
  //  socket.broadcast.to('INDEX').emit('updatechat', 'SERVER', username + ' has connected to this room');
  //  socket.emit('updaterooms', rooms, 'INDEX');
  var k = 0;
  for(var i=0; i<rooms.length+1;i++){
    socket.emit('updaterooms', rooms, rooms[k]);
    k++;
  }

  });









/////////////////////////// 내가만듦
  socket.on('duduman', function(){
    //io.sockets.manager.rooms;
    for(var i=0; i<rooms.length+1;i++){
      socket.emit('updaterooms', rooms, rooms[i]);
  }
  });








/////////////////////////// 내가만듦
  socket.on('bangbang', function (datav) {
    //socket.username = username;
    //usernames[username] = username;
    var j = 0;
    socket.room = datav;
    for(var i=0; i<rooms.length;i++){
      j++;
    }
    for(var i=j; i < j+1; i++){
        rooms[i] = datav;
        ///////////////////////
        //socket.emit('duduman', rooms, datav);
    }
    socket.join(datav);
    // echo to client they've connected
    socket.emit('updatechat', 'SERVER', 'you have connected to create room!');
    // echo to room 1 that a person has connected to their room         username +
    //밑에 코드가 안먹히는 것 같음.
    socket.broadcast.to(datav).emit('updatechat', 'SERVER', ' has connected to this room');
    socket.emit('updaterooms', rooms, datav);
  });

  





  // when the client emits 'sendchat', this listens and executes
  socket.on('sendchat', function (data) {
    // we tell the client to execute 'updatechat' with 2 parameters
    io.sockets.in(socket.room).emit('updatechat', socket.username, data);
  });






//업데이트룸 
  socket.on('switchRoom', function(newroom){
    socket.leave(socket.room);
    socket.join(newroom);
    socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
    // sent message to OLD room
    socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
    // update socket session room title
    socket.room = newroom;
    socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
    socket.emit('updaterooms', rooms, newroom);
  });//broadcast





  //방지울때 
  socket.on('jiu', function(){
    for(var i=0; i < rooms.length+1; i++){
      if(rooms[i] == socket.room){
        alert('진짜 지운다?');
        delete rooms[i];
        //socket.leave(rooms[i]);
      }
      socket.emit('updaterooms', rooms, rooms[i]);
    }
  });






  // 유저 끊겼을때 수행이거 when the user disconnects.. perform this
  socket.on('disconnect', function(){
    // remove the username from global usernames list
    delete usernames[socket.username];
    //delete rooms[socket.room];
    // update list of users in chat, client-side
    io.sockets.emit('updateusers', usernames);
    // echo globally that this client has left
    socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username + ' has disconnected');
    //socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
    socket.leave(socket.room);
    for(var i=0; i < rooms.length+1; i++){
      if(rooms[i] == socket.room){
        delete rooms[i];
        socket.leave(rooms[i]);
      }
      socket.emit('updaterooms', rooms, rooms[i]);
    }
    //socket.emit('updaterooms', rooms, socket.room);
    /////////////////////////////////
            // io.sockets.emit('updaterooms', rooms);
    // for( var i=0; i<rooms.length; i++){
    //   if(rooms[i] == socket.room){
    //     clients[i].leave(socket.room);
    //     break;
    //   }
    // }



//     var clients = io.sockets.clients(rooms);
//     for (var i = 0; i < clients.length; i++){
//     clients[i].leave(rooms);
// }
  });//broadcast




});
















































/*

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

*/
//module.exports = app;

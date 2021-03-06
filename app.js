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
var fs = require('fs');

var FCM = require('fcm').FCM;
var apiKey = 'AIzaSyBflQ6np9ZMIRkoEN22W7dSS5fJPgVqRPA';
var fcm = new FCM(apiKey);



app.get('/endpoint', function(request, response) {
    var id = request.query.id;
    response.end("I have received the ID: " + id);
    console.log("id is "+id);
    
var message = {
    registration_id: id, // required
    collapse_key: 'Collapse key',
    data: 'this is fcm test',
    data2: 'this is data2 war !'
};

fcm.send(message, function(err, messageId){
    if (err) {
        console.log("Something has gone wrong!");
    } else {
        console.log("Sent with message ID: ", messageId);
    }
});

});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
/*
app.get('/', function(req, res){
res.render('index', function(error, data){
  if(error){
    console.log(error);
  }else{

  }
});

});*/
var routes = require('./routes/index');
var users = require('./routes/users');

server.listen(3000);

// view engine setup


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
    subject: "궁물 문의할게요!!!",
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



// 세션 기본설정
app.use(session({
  secret : 'keyboard cat',
  resave : false,
  saveUninitialized : true

}))



// 로그인 시키기
app.post('/login',function(req,res){
  var email = req.body.email;
  var password = req.body.password;

var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'kitri',
  database : 'project'
});

connection.connect();

connection.query('SELECT count(*) cnt, nickname from nodeuser where email = ? and password = ?', [email, password], function(err, rows, fields) {
  if (!err){
    var cnt = rows[0].cnt;
    username = rows[0].nickname;
    
    if(cnt == 1){
      req.session.email = email; 
      

//      console.log(req.session.email);

  res.end(username);

}else{
  res.end("no");
  }
}else{
    console.log('Error while performing Query.');
  }
});
connection.end();



});


/*
app.post('/sum',function(req,res){


var email = req.body.email; 
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'kitri',
  database : 'project'
});

connection.connect();

connection.query('SELECT count(*) cnt from ask where email = ?', [email], function(err, rows, fields) {
  if (!err){
    var cnt = rows[0].cnt;
    
    console.log(cnt);
    
  res.end(cnt);

}else{
  res.end("no");
  }

});
connection.end();

  

});

*/




// 로그아웃하기 세션파괴하면서
app.post('/logout',function(req,res){
req.session.destroy(function(err){
if(err) console.error('err', err);
  res.end("ok");
})

  

});


// 질문할때 로그인 안돼있으면 못가게 체크
app.post('/checkask',function(req,res){
if(req.session.email){
  console.log("질문등록 오케이 ");
  res.end(req.session.email)

}else{
console.log("질문등록 노");
  res.end("no")
  
}


});

// 질문하는 방 들어갈때 로그인 안돼있으면 못가게 체크
app.post('/checkjoinask',function(req,res){
if(req.session.email){
  console.log("질문체크 오케이");
  res.end(req.session.email)

}else{
console.log("질무문체크 노노");
  res.end("no")
  
}


});


// 질문정보 저장
app.post('/saveask',function(req, res){

var roomname = req.body.roomname;
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'kitri',
  database : 'project'
});

connection.connect();

connection.query('insert into ask(email, subject) values(?, ?)', [req.session.email, roomname], function(err, rows, fields) {
  if (!err){
  
  console.log("삽입성공");  
  res.end("ok")

}else{
  console.log("실패");
  res.end("no")
  }

});
connection.end();   

});






// 채팅서버

var usernames = {};
// rooms which are currently available in chat
var rooms = [];

var count = 0;



io.sockets.on('connection', function (socket) {

console.log("새접속자 올때마다 뜨나");
 
  // when the client emits 'adduser', this listens and executes
    socket.on('adduser', function(username){
    // store the username in the socket session for this client
    
    // store the room name in the socket session for this client
  //  socket.room = 'INDEX';
    // add the client's username to7 the global list
    
    socket.username = username;
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
    for(var i=0; i<rooms.length+100;i++){
      if(rooms[i] == null){
        delete rooms[i];
        socket.emit('updaterooms', rooms, rooms[i]);
       }
  }
  });


//////0819수정
/////////////////////////// 내가만듦
  socket.on('makingask', function (datav, datan) {
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'kitri',
  database : 'project'
});

connection.connect();

connection.query('SELECT count(*) cnt from ask where email = ? and subject = ?', [datan, datav], function(err, rows, fields) {
  if (!err){
    var cnt = rows[0].cnt;   
console.log(cnt);    
    
    if(cnt == 1){           

console.log("질문자가 접속하는거다 메킹에서");
/*
connection.query('update ask set me = on where subject = ?', [datav], function(err, rows, fields) {
  if (!err){}
});
*/

}else{
  console.log("d안되나 ?????");
  


  }
}else{
    console.log('Error while performing Query.');
  }
});
connection.end();


socket.emit('changebutton');
    
    socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has connected to this room');
    var j = 0;
    socket.room = datav;
    roomname = datav;






    for(var i=0; i<rooms.length;i++){
      j++;
    }
    for(var i=j; i < j+1; i++){
        rooms[i] = datav;
        ///////////////////////
        //socket.emit('duduman', rooms, datav);
    }
    // socket.join(datav);
    // echo to client they've connected
    socket.emit('updatechat', 'SERVER', '답변자가 들어오길 기도합시다!');
    socket.join(datav);
    // echo to room 1 that a person has connected to their room         username +
    // socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has connected to this room');
    socket.emit('updaterooms', rooms, datav);
    


  });




  // when the client emits 'sendchat', this listens and executes
  socket.on('sendchat', function (data) {
    // we tell the client to execute 'updatechat' with 2 parameters
    io.sockets.in(socket.room).emit('updatechat', socket.username, data);
  });




//////0819수정
//socket.room은 현재방이얌
//업데이트룸      ///////////수정헀음 오류고치기위해서(새로고침 후에 같은 방 또 누르면 생겼던 에러)
  socket.on('switchRoom', function(newroom, datan){
    if(newroom == socket.room){

var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'kitri',
  database : 'project'
});

connection.connect();

connection.query('SELECT count(*) cnt from ask where email = ? and subject = ?', [datan, newroom], function(err, rows, fields) {
  if (!err){
    var cnt = rows[0].cnt;   
    
    if(cnt == 1){      
      
console.log("질문자가 접속하는거다 방바꾸는거 위에거 ");

socket.emit('changebutton');

}else{
  
socket.emit('hidebutton');

  }
}else{
    console.log('Error while performing Query.');
  }
});
connection.end();



      socket.join(socket.room);
      socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' 님이 방을 떠나셨습니다.');
      io.sockets.in(socket.room).emit('updatechat', 'SERVER', socket.username+' 님이 접속 하였습니다.');
      socket.emit('updaterooms', rooms, socket.room);
    }else{




var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'kitri',
  database : 'project'
});

connection.connect();

connection.query('SELECT count(*) cnt from ask where email = ? and subject = ?', [datan, newroom], function(err, rows, fields) {
  if (!err){
    var cnt = rows[0].cnt;   
    
    if(cnt == 1){      
      
console.log("질문자가 접속하는거다 방바꾸는거 아래꺼");

}else{
  socket.emit('hidebutton');


  }
}else{
    console.log('Error while performing Query.');
  }
});
connection.end();



    socket.leave(socket.room);
    socket.join(newroom);
    socket.emit('updatechat', 'SERVER', '당신은 '+ newroom+'질문에 접속하였습니다.');
    // sent message to OLD room
    socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' 님이 방을 나가셨습니다.');
    // update socket session room title
    socket.room = newroom;
    socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' 님이 들어오셨습니다.');
    socket.emit('updaterooms', rooms, newroom);
  }
  });//broadcast







//0819수정
  //방지울때
    socket.on('jiu', function(){
      //alert(socket.room+'을 지웁니다?');
    for(var i=0; i < rooms.length+1; i++){
      if(rooms[i] == socket.room){
        //alert('진짜 지운다?');
        delete rooms[i];
        socket.emit('updaterooms', rooms, rooms[i]);
      }
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
  });//broadcast



socket.on('dis', function(){
    // remove the username from global usernames list
    delete usernames[socket.username];
    //delete rooms[socket.room];
    // update list of users in chat, client-side
    io.sockets.emit('updateusers', usernames);
    // echo globally that this client has left
    socket.leave(socket.room);
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

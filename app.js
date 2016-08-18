var express = require('express');
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

var app = express();

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


module.exports = app;

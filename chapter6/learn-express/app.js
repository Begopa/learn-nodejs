var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(function(req, res, next) {
  console.log(req.url, '저도 미들웨어입니다');
  next();
});

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secret code'));
app.use(session({
  resave: false, // 요청이 왔을때 세션에 수정사항이 생기지 않더라도 세션을 저장할지 여부
  saveUninitialized: false, // 세션에 저장할 내역이 없더라도 세션을 저장할지에 대한 설정
  secret: 'secret code', //cookieParser의 비밀키와 같은 역할
  cookie: {
    httpOnly: true, // 클라이언트에서 쿠키 확인 못하게 설정
    secure: false, // https가 아닌 환경에서도 사용가능
  },
}));
app.use(flash()); // req 객체에 req.flash메서드 추가, req.flash(키, 값)으로 해당 값 설정, req.flash(키)로 해당 값 확인

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

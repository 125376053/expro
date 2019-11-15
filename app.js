var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')

const redis = require('redis')

var client=redis.createClient(6379,'39.106.94.75',{
    auth_pass:'123456'
});

var session = require('express-session');//session
var RedisStrore = require('connect-redis')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret: 'zcj',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60
    },
    store:new RedisStrore({
        client
    }),
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.set('view engine','html');//设置模板引擎 html
app.set('views',path.resolve('views'));//指定模板的存放根目录
app.engine('html',require('ejs').__express);//指定对于html类型的模板使用ejs方法来进行渲染

app.use(function (req, res, next) {
    next(createError(404));
});


app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    // res.render('error');
    // 输入不存在的路由匹配到登录页
    // res.redirect('/login.html')
    res.send(err)
});

module.exports = app;

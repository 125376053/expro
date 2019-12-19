var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var url = require('url')
const redis = require('redis')
var client = redis.createClient(6379, '39.106.94.75', {
    auth_pass: '123456'
});

var session = require('express-session');
var RedisStrore = require('connect-redis')(session);

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: 'zcj',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge:1000 //1000 * 60 * 60
    },
    store: new RedisStrore({
        client
    }),
}));

// 路由拦截中间件 注意不是匹配* 要放在session后面使用
// 不需要登录的路由信息
var notLogin = ['/', '/users/captcha', '/login.html', '/users/login','/logout']
app.use(function (req, res, next) {
    //console.log(req.session)
    let urlObj = url.parse(req.url)
    if(notLogin.indexOf(urlObj.pathname)>-1){
        next()
    }else{
        console.log('----------------------------')
        console.log(req.session.user);
        if(req.session.user){
            if(urlObj.pathname=='/login.html'){
                res.redirect('/home.html')
            }else{
                next()
            }
        }else{
            console.log('---没有session22222来这里----')
            res.redirect('/login.html')
        }
    }
})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(3001)

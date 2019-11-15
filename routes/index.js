var express = require('express');
var router = express.Router();
var fs =require('fs')
var path = require('path')


router.get('/', function (req, res, next) {
    let fileName = path.join(__dirname,'/public/home.html')
    console.log(fileName)
    // res.sendFile(__dirname+'/public/home.html');
    // res.render('a',{})
    // res.end('ok')
    // fs.createReadStream(filename).pipe(res);
    // res.sendfile('../public/home.html')  // sendfile 默认模板引擎报错
    res.redirect('/login.html')  // 重定向路由
});

router.get('/home', function (req, res, next) {
    let session_user = req.session.user
    if(session_user){
        res.send({
            code:1,
            msg:'',
            user:session_user
        })
    }else{
        res.send({
            code:0,
            msg:'登录失效'
        })
    }
    res.end('a')
});

module.exports = router;

var express = require('express');
var router = express.Router();
var fs = require('fs')
var path = require('path')
var db = require('../model/pool').db
var pool = require('../model/pool').pool
router.get('/', function (req, res, next) {
    let fileName = path.join(__dirname, '/public/home.html')
    console.log(fileName)
    // res.sendfile('../public/home.html')  // sendfile 默认模板引擎报错
    console.log(234);
    res.redirect('/login.html')  // 重定向路由
});

router.get('/logout', function (req, res) {
    req.session.user = null
    console.log('logout')
    res.send({
        code: 1,
        msg: '',
        data: 'ok'
    })
})

router.get('/home', function (req, res, next) {
    let session_user = req.session.user
    if (session_user) {
        res.send({
            code: 1,
            msg: '',
            user: session_user
        })
    } else {
        res.send({
            code: 0,
            msg: '登录失效'
        })
    }
});

var formidable = require('formidable'); //专门处理图片上传的
var uuid = require('uuid'); //生成绝对不重复的字符串
router.post('/upload', function (req, res) {

    new formidable.IncomingForm().parse(req, function (err, fields, files) {
        console.log(files.file.name); //上传后图片的名字
        console.log(files.file.path); //上传后图片的默认地址
        var filename = uuid.v4() + path.extname(files.file.name);//不重复字符串+图片后缀名
        fs.createReadStream(files.file.path).pipe(
            fs.createWriteStream(
                path.normalize(
                    path.join(__dirname, '../public/upload/',filename)
                )
            )
        );


        // 路径拼接编译
        console.log(path.normalize(path.join(__dirname, '../public/upload/',filename)));
        console.log(path.join(__dirname, '../public/upload/',filename));


        /*
        访问静态资源路由地址 public目录下 去掉public
        http://localhost:3001/upload/1.html
        1数据库中保存的图片是不带域名的
        2图片的关联用户是谁
        {
            name:'zhangchaojie',
            img:'/upload/90c0d5e1-279c-4476-922f-9021bdfeaf62.png'
        }
        */

        // 保存数据时 es6模板字符串中的变量要用单引号引起来
        db.q(`insert into userImg (user,img) values ('${req.session.user.user}','/upload/${filename}')`, (err, ret) => {
            console.log(ret);
        })

        //把文件名发送给客户端 ajax data数据 ret
        res.send(filename);
    })
});

// 用户详情
router.get('/info', (req, res) => {
    let id = req.query.id
    // select * from user where id=1
    // select * from user a join userImg b on a.user = b.user where a.id='${id}'
    //`select * from user join userImg on user.user = userImg.user where user.id='${id}'`
    pool.query(`select a.user,b.img from user a join userImg b on a.user = b.user where a.id='${id}'`, (err, ret) => {
        console.log(ret)
        res.json({
            code: 1,
            msg: '',
            data: ret
        })
    })
})

router.get('/list', async (req, res) => {

    /*
     * 每页显示2条
     * 1 : 1-2 skip:0 -> (当前页-1) * limit
     * 2 : 3-4 skip:2
     * */
    let page = Number(req.query.page || 1);
    let limit = Number(req.query.limit || 5);
    pool.query(`select user from user`, function (err, ret) {
        var count = ret.length // 11
        //计算总页数
        let pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);

        //console.log(count, pages, page);
        pool.query(`select * from user order by id desc limit ${page},${limit}`, function (err, ret) {
            //console.log(ret)
            res.json({
                pages:pages,
                data:ret
            })
        })
    })


})

module.exports = router;

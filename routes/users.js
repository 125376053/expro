var express = require('express');
var router = express.Router();

var model = require('../model/index')
var encryUtils=require('../utils/encryUtils.js');

const captcha = require('svg-captcha');
router.get('/captcha',function(req,res){
    const cap = captcha.create({
        size: 4, // 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        noise: 1, // 干扰线条的数量
        color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
        background: '#cc9966' // 验证码图片背景颜色
    });
    //console.log(cap);
    req.session.captcha = cap.text; // session 存储
    res.type('svg'); // 响应的类型
    res.send(cap.data);
})

router.post('/login', async function(req, res, next) {
    let {user,pass,ma} = req.body;
    //console.log(user, pass,ma);

    if(user && pass && ma){
        // 查找用户是否存在
        let user1 = await model.getOne({
            where:{
                user
            }
        })
        // 没有用户时插入数据
        if(!user1){
            console.log('创建的时候')
            let re = await model.create({
                user,
                pass:encryUtils.encrypt(pass) //对写入数据库的密码进行md5加密
            })
            req.session.user = re.dataValues
            if(ma.toUpperCase() == req.session.captcha.toUpperCase()){
                res.json({
                    code:1,
                    msg:'登录成功'
                })
            }else{
                res.json({
                    code:0,
                    msg:'验证码输入错误'
                })
            }
            return
        }

        if(user1){
            let pass1 = user1.dataValues.pass
            // 查找密码的时候也要查找加密过的密码
            if(pass1 == encryUtils.encrypt(pass)){
                req.session.user = user1.dataValues
                //console.log(req.session.user);
                if(ma.toUpperCase() == req.session.captcha.toUpperCase()){
                    res.json({
                        code:1,
                        msg:'登录成功'
                    })
                }else{
                    res.json({
                        code:0,
                        msg:'验证码输入错误'
                    })
                }
            }else{
                res.json({
                    code:0,
                    msg:'密码输入不对'
                })
            }
        }
    }else{
        res.json({
            code:0,
            msg:'请输入用户名和密码'
        })
    }
});

router.get('/userList',async (req,res)=>{
    let data = await model.getAll()
    res.json({
        code:1,
        msg:'',
        data:data
    })
})

router.post('/updatePass',async (req,res)=>{
    console.log(req.body);
    let id= req.body.id
    let pass = await model.update(
        {
            pass:encryUtils.encrypt('123456')
        },
        {
            where:{
                id
            }
        }
    )
    console.log(pass);
    res.json({
        code:1,
        msg:'',
        data:'ok'
    })
})

router.post('/remove',async (req,res)=>{
    let id= req.body.id
    let re = await model.remove({
        where:{
            id
        }
    })
    console.log(re)
    res.json({
        code:1,
        msg:'',
        data:re
    })
})

module.exports = router;

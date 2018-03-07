var express = require('express');
var router = express.Router();
var userModel=require('../models/UserModel');
var svgCaptcha = require('svg-captcha');
var request = require('superagent');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//routes/users.js中添加
router.all('/login', function(req, res) {
  subflag=req.body['subflag']
  if(subflag==undefined){
    res.render('zplogin');
  }
  else{
    console.log('email:'+req.body['email'])
    userModel.login(req,res)
  }
  
});

router.all('/register', function(req, res1) {
  subflag=req.body['subflag']
  if(subflag==undefined){
    if(req.query['email']==undefined){
      res1.render('zpregister');
    }else{
      if(!userModel.phoneUnique(req,res1)){
        console.log("phone"+req.query['email'])
        code =parseInt(Math.random()*(9999-1000+1)+1000,10);
        console.log('code:'+code)
        phone=req.query['email']
        request
          .get("https://fesms.market.alicloudapi.com/sms/")
          .query({code:code,phone:phone,skin:"21551"})
          .set('Authorization','APPCODE bff9e6f2e66b447da96cef3e3f2835f5')
          .accept('json')
          .then(function(res){
            console.log("发送结果"+res.body.Code)
            if(res.body.Code.indexOf('LIMIT_CONTROL')>-1){
              res1.send("<script>alert('操作频繁，请稍后发送');history.back();</script>");
            }else{
              res1.send("<script>alert('请等待验证码');history.back();</script>");
            }
          }).catch(function(err){
            console.log("错误信息："+err.message)
          })
      }else{
        res1.send("<script>alert('号码重复');history.back();</script>");
      }
      
      // res1.send("<script>alert('请等待验证码');history.back();</script>");
    }
  }else{
    if(req.body['agree']!=undefined){
      req.body['email']=phone;
      console.log('aaaaaa')
      userModel.zhuce(req,res1,code,phone)
    }else{
      res1.send("<script> alert('请阅读Zippping管理规定');history.back();</script>")
      return
    }
  }
});
router.post('/zhuce',function(req,res){
  userModel.zhuce(req,res);
  //res.send('注册')
})
module.exports = router;

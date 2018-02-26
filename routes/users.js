var express = require('express');
var router = express.Router();
var userModel=require('../models/UserModel');
var svgCaptcha = require('svg-captcha');

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
    userModel.login(req,res)
  }
  
});

router.all('/register', function(req, res) {
 
  subflag=req.body['subflag']
  if(subflag==undefined){
    var captcha = svgCaptcha.create({width:150,height:20,fontSize:27});
    svg = captcha.text;
    console.log(captcha.text)
    
    // var svg = captcha.data;
    // console.log(captcha.data)
    res.type('html');
    res.render('zpregister',{svg:captcha.data});
  }
  else{
    console.log("后台的验证码:"+svg)
    userModel.zhuce(req,res,svg)
  }
  
});
router.post('/zhuce',function(req,res){
  userModel.zhuce(req,res);
  //res.send('注册')
})
module.exports = router;

var express = require('express');
var router = express.Router();
var userModel=require('../models/UserModel')

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
    res.render('zpregister');
  }
  else{
    userModel.zhuce(req,res)
  }
  
});
router.post('/zhuce',function(req,res){
  userModel.zhuce(req,res);
  //res.send('注册')
})
module.exports = router;

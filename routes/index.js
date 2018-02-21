var express = require('express');
var router = express.Router();
var employmentmodel = require('../models/EmploymentModel')
// var questionModel=require('../models/QuestionModel')

/* GET home page. */
router.get('/', function(req, res, next) {
  loginbean = req.session.loginbean;
  console.log(loginbean);//*******
  employmentmodel.emyList(req,res,loginbean);//******** */


  //console.log(loginbean.nicheng);
  
  //res.render('zpindex', {loginbean:loginbean});
});
router.get('/logout',function(req,res){ 
  req.session.destroy(function() { 
      //res.send("location.href='/index';"); 
        res.redirect('/'); 
    }) 
});

module.exports = router;

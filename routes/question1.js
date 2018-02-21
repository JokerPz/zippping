var express = require('express');
var router = express.Router();
var checksession = require('../jsbean/CheckSession')
var questionmodel = require('../models/QuestionModel')

router.all('/ask',function(req,res){
    subflag=req.body['subflag']
    loginbean=checksession.check(req,res);
    if(!loginbean){
        return;
    }
    if(subflag==undefined){
        res.render('ask');
    }
    else{
        //console.log('aaaa')
        questionmodel.ask(req,res)
    }
    

})

router.get('/detail',function(req,res){
    questionmodel.queDetail(req,res)

})

module.exports=router;
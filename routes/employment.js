var express = require('express');
var router = express.Router();
var checksession = require('../jsbean/CheckSession')
var employmentmodel = require('../models/EmploymentModel')

router.all('/emy',function(req,res){//发帖路由 
    subflag=req.body['subflag']
    loginbean=checksession.check(req,res);
    if(!loginbean){
        return;
    }
    if(subflag==undefined){
        res.render('zpemy');
    }
    else{
        employmentmodel.emy(req,res)
    }
})

router.get('/detail',function(req,res){
    employmentmodel.emyDetail(req,res)

})

router.get('/eplist',function(req,res){
    //res.send('aaa')
    loginbean=checksession.check(req,res)
    if(!loginbean){
        return;
    }
    else{
        employmentmodel.epList(req,res)
    }
})

router.get('/collection',function(req,res){
    loginbean=checksession.check(req,res)
    if(!loginbean){
        return
    }else{
        employmentmodel.collection(req,res)
    }
    
})

router.get('/collection/list',function(req,res){
    loginbean=checksession.check(req,res)
    if(!loginbean){
        return
    }else{
        employmentmodel.collectionList(req,res)
    }
})

module.exports=router;
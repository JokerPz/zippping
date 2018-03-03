var express = require('express')
var router = express.Router();
var checksession = require('../jsbean/CheckSession')
var administrator = require('../models/Administrator')

router.get('/',function(req,res,next){
    loginbean=checksession.checkadmin(req,res);
    administrator.administrate(req,res);
})

router.get('/examine/wait',function(req,res,next){
    loginbean=checksession.checkadmin(req,res);
    //res.send('aaaaaa')
    administrator.examine_wait(req,res);
})


router.get('/examine/pass',function(req,res,next){
    loginbean=checksession.checkadmin(req,res);
    //res.send('aaaaaa')
    administrator.examine_pass(req,res);
})

router.get('/examine/fail',function(req,res,next){
    loginbean=checksession.checkadmin(req,res);
    //res.send('aaaaaa')
    administrator.examine_fail(req,res);
})

router.get('/examine/wait/detail',function(req,res,next){
    loginbean=checksession.checkadmin(req,res);
    //res.send('aaaaaa')
    administrator.examine_wait_detail(req,res);
})

router.post('/examine',function(req,res){
    if(req.body['status']==3){
        administrator.delete(req,res)
    }else if(req.body['status']==-1){
        administrator.faile(req,res)
    }else if(req.body['status']==1){
        administrator.pass(req,res)
    }
   
})



module.exports=router;
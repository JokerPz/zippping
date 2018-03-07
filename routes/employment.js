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
        if(req.session.loginbean.privilige==1){
            res.render('zpemy_admin');
        }else{
            res.render('zpemy');
        }
        
    }
    else{
        if(req.body['agree']!=undefined){
            employmentmodel.emy(req,res)
        }else{
            res.send("<script> alert('请阅读Zippping管理规定');history.back();</script>")
            return
        }
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

router.get('/collection/del',function(req,res){
    loginbean=checksession.check(req,res)
    if(!loginbean){
        return
    }else{
        employmentmodel.collectionDel(req,res)
    }
})

router.get('/perdetail',function(req,res){
    loginbean=checksession.check(req,res)
    if(!loginbean){
        return
    }else{
        employmentmodel.pusDetail(req,res)
    }
})

router.post('/delete',function(req,res){
    loginbean=checksession.check(req,res)
    if(!loginbean){
        return
    }else{
        employmentmodel.emyDelete(req,res)
    }
})

router.post('/aaa',function(req,res){
    res.send('已收藏')
})


module.exports=router;
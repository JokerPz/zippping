var express = require('express')
var router = express.Router();
var administrator = require('../models/Administrator')

router.get('/',function(req,res,next){
    //res.send('aaaaaa')
    administrator.administrate(req,res);
})

module.exports=router;
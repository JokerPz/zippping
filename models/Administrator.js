var connPool = require("./ConnPool");
var LoginBean=require("../jsbean/LoginBean")
module.exports={
    administrate:function(req,res){
        pool= connPool();
        pool.getConnection(function(err,conn){
            if(err){
                res.send('连接错误，错误原因'+err.message)
            }
            var adlistsql='select uid,email,pwd,nicheng,updtime,privilige,handler from user'
            var param=[]
            conn.query(adlistsql,param,function(err,rs){
                if(err){
                    res.send('查询错误'+err.message);
                }else{
                    res.render('zpadmin',{rs:rs})
                }
                
            })
            conn.release();
        })
    }
}
        
var connPool = require("./ConnPool");
var LoginBean=require("../jsbean/LoginBean")
module.exports={
    zhuce:function(req,res,code,phone){
        console.log('code:'+req.body['code'])
        // req.body['email']=phone
        console.log('email:'+req.body['email'])
        // console.log("后台的验证码:"+svg)
        // console.log("输入的验证码:"+req.body['svg'])
        if(req.body['code']!=code){
            sendStr = "<script> alert('验证码错误');history.back();</script>"
            res.send(sendStr)
            return
        }else{ 
            pool=connPool();
            //从pool中获取连接(异步,取到后回调) 
            pool.getConnection(function(err,conn){ 
                if(err){
                    res.send('获取链接错误，错误原因：'+err.message)
                    console.log('获取链接错误，错误原因：'+err.message)
                    return
                }
                var userAddSql = 'insert into user (email,pwd,nicheng,createtime) values(?,?,?,current_timestamp)'; 
                var param = [phone,req.body['pwd'],req.body['nicheng']]; 
                conn.query(userAddSql,param,function(err,rs){ 
                    if(err){ 
                        //console.log('insert err:',err.message); 
                        //res.send("数据库错误,错误原因:"+err.message); 
                        errStr = err.message; 
                        sendStr = "<script> "; 
                        if(errStr.indexOf('emailuniq')>-1){ 
                            sendStr += "alert('号码重复');"; 
                        }else if(errStr.indexOf('nichenguiq')>-1){ 
                            sendStr += "alert('昵称重复');"; 
                        }
                        sendStr += " history.back();</script>" 
                        res.send(sendStr); 
                        return; 
                    }
                    res.send('<script>alert("注册成功");location.href="/users/login";</script>'); 
                    //res.redirect() 
                }) 
                conn.release();
            })
        } 
    },
    login:function(req,res){
        pool=connPool();
        //从pool中获取连接(异步,取到后回调) 
        pool.getConnection(function(err,conn){ 
            if(err){
                res.send('获取链接错误，错误原因：'+err.message)
                return;
            }
            var userSql = 'select uid,nicheng,privilige from user where email=? and pwd=?';   
            var param = [req.body['email'],req.body['pwd']];   
            conn.query(userSql,param,function(err,rs){   
                if(err){   
                    //console.log('insert err:',err.message);   
                    res.send("数据库错误,错误原因:"+err.message);
                    console.log("数据库错误,错误原因:"+err.message)   
                    return;   
                }   
                console.log(rs);   
                //console.log(rs.length);   
                if(rs.length>0){ 
                    loginbean = new LoginBean();    
                    loginbean.id=rs[0].uid;    
                    loginbean.nicheng = rs[0].nicheng;
                    loginbean.privilige= rs[0].privilige;
                    req.session.loginbean = loginbean; 
                    res.redirect('/')
                    
                    
                }else{   
                    res.send('<script>alert("账号/密码错误,请重新输入");location.href="/users/login";</script>')  
                }   
            })   
            conn.release();
        })
    }, 
    phoneUnique:function(req,res){
        pool=connPool();
        //从pool中获取连接(异步,取到后回调) 
        pool.getConnection(function(err,conn){ 
            if(err){
                res.send('获取链接错误，错误原因：'+err.message)
                return
            }
            else{
                console.log('email:'+req.query['email'])
                var findsql='select uid from user where email=?'
                var param=[req.query['email']]
                conn.query(findsql,param,function(err,rs){   
                    if(err){   
                        //console.log('insert err:',err.message);   
                        res.send("数据库错误,错误原因:"+err.message);
                        console.log("数据库错误,错误原因:"+err.message)   
                        return;   
                    }
                    console.log("rs.length:"+rs.length)
                    if(rs.length>0){
                        console.log('aaa')
                        return false;
                    }else{
                        console.log('bbb')
                        return true;
                    }
                })   
            }
            conn.release();
        })
    },
    agreement:function(req,res){
        if(req.session.loginbean!=undefined){
            res.render('zpagreement',{loginbean:req.session.loginbean})
        }else{
            res.render('zpagreement')
        }
       
    }
}
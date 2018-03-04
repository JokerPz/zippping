var connPool = require("./ConnPool");
var LoginBean=require("../jsbean/LoginBean")
var async=require('async')
var moment = require('moment')
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
    },
    examine_wait:function(req,res){
        pool= connPool();
        pool.getConnection(function(err,conn){
            if(err){
                res.send('获取链接错误，错误原因：'+err.message)
            }
            page=1;
            if(req.query['page']!=undefined){
                page=parseInt(req.query['page']);
                if(page<1){
                    page=1;
                }
            }
            pageSize=15;//每页显示多少条帖子
            pointStart=(page-1)*pageSize;
            count=0;
            countPage=0;
            
            if(req.query['business']==undefined){
                //console.log('第五步')
                var countSql='select count(tid) from employment where status = 0'
                var listSql = 'select tid,title,type,place,year,month,day,hour,minute,updtime,createtime,business from employment where status = 0 order by updtime  limit ?,?';  
                var param = [pointStart,pageSize];
            }else{
                //console.log('第四步')
                var countSql='select count(tid) from employment where status=0 and business="'+req.query['business']+'"'
                var listSql = 'select tid,title,type,place,year,month,day,hour,minute,updtime,createtime,business from employment where status=0 and business="'+req.query['business']+'" order by updtime  limit ?,?';  
                var param = [pointStart,pageSize];
                
            }
            async.series({
                one:function(callback){
                    conn.query(countSql,[],function(err,rs){ 
                        count=rs[0]['count(tid)']
                        countPage=Math.ceil(count/pageSize)
                        if(page>countPage){
                            page=countPage
                            pointStart=(page-1)*pageSize;

                        }
                        param = [pointStart,pageSize]
                        callback(null,rs)
                    })   
                },
                two:function(callback){
                    conn.query(listSql,param,function(err,rs){
                        callback(null,rs)  
                    }) 
                }
            },function(err,results){
                rs=(results['two'])
                if(req.session.loginbean==undefined){
                    res.render('zpindex', { title: 'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page,business:req.query['business']});
                }else{
                    if(req.session.loginbean.privilige==1){
                        res.render('zpexamine_w', { title: 'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page,business:req.query['business']});
                    }else{
                        res.render('zpindex', { title: 'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page,business:req.query['business']});
                    }
                }
            })
            conn.release();
        })
       
    },
    examine_pass:function(req,res){
        pool= connPool();
        pool.getConnection(function(err,conn){
            if(err){
                res.send('获取链接错误，错误原因：'+err.message)
            }
            page=1;
            if(req.query['page']!=undefined){
                page=parseInt(req.query['page']);
                if(page<1){
                    page=1;
                }
            }
            pageSize=15;//每页显示多少条帖子
            pointStart=(page-1)*pageSize;
            count=0;
            countPage=0;
            
            if(req.query['business']==undefined){
               // console.log('第五步')
                var countSql='select count(tid) from employment where status = 1'
                var listSql = 'select tid,title,type,place,year,month,day,hour,minute,updtime,createtime,business,handler from employment where status = 1 order by updtime desc limit ?,?';  
                var param = [pointStart,pageSize];
            }else{
               // console.log('第四步')
                var countSql='select count(tid) from employment where status=1 and business ="'+req.query['business']+'"'
                var listSql = 'select tid,title,type,place,year,month,day,hour,minute,updtime,createtime,business,handler from employment where status=1 and business="'+req.query['business']+'" order by updtime desc limit ?,?';  
                var param = [pointStart,pageSize];
                
            }
            async.series({
                one:function(callback){
                    conn.query(countSql,[],function(err,rs){ 
                        count=rs[0]['count(tid)']
                        countPage=Math.ceil(count/pageSize)
                        if(page>countPage){
                            page=countPage
                            pointStart=(page-1)*pageSize;

                        }
                        param = [pointStart,pageSize]
                        callback(null,rs)
                    })   
                },
                two:function(callback){
                    conn.query(listSql,param,function(err,rs){
                        callback(null,rs)  
                    }) 
                }
            },function(err,results){
                rs=(results['two'])
                if(req.session.loginbean==undefined){
                    res.render('zpindex', { title: 'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page,business:req.query['business']});
                }else{
                    if(req.session.loginbean.privilige==1){
                        res.render('zpexamine_p', { title: 'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page,business:req.query['business']});
                    }else{
                        res.render('zpindex', { title: 'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page,business:req.query['business']});
                    }
                }
            })
            conn.release();
        })
       
    },
    examine_fail:function(req,res){
        pool= connPool();
        pool.getConnection(function(err,conn){
            if(err){
                res.send('获取链接错误，错误原因：'+err.message)
            }
            page=1;
            if(req.query['page']!=undefined){
                page=parseInt(req.query['page']);
                if(page<1){
                    page=1;
                }
            }
            pageSize=15;//每页显示多少条帖子
            pointStart=(page-1)*pageSize;
            count=0;
            countPage=0;
            
            if(req.query['business']==undefined){
                console.log('第五步')
                var countSql='select count(tid) from employment where status = -1'
                var listSql = 'select tid,title,type,place,year,month,day,hour,minute,updtime,createtime,business,handler from employment where status = -1 order by updtime desc limit ?,?';  
                var param = [pointStart,pageSize];
            }else{
                console.log('第四步')
                var countSql='select count(tid) from employment where status=-1 and business ="'+req.query['business']+'"'
                var listSql = 'select tid,title,type,place,year,month,day,hour,minute,updtime,createtime,business,handler from employment where status=-1 and business="'+req.query['business']+'" order by updtime desc limit ?,?';  
                var param = [pointStart,pageSize];
                
            }
            async.series({
                one:function(callback){
                    conn.query(countSql,[],function(err,rs){ 
                        count=rs[0]['count(tid)']
                        countPage=Math.ceil(count/pageSize)
                        if(page>countPage){
                            page=countPage
                            pointStart=(page-1)*pageSize;

                        }
                        param = [pointStart,pageSize]
                        callback(null,rs)
                    })   
                },
                two:function(callback){
                    conn.query(listSql,param,function(err,rs){
                        callback(null,rs)  
                    }) 
                }
            },function(err,results){
                rs=(results['two'])
                if(req.session.loginbean==undefined){
                    res.render('zpindex', { title: 'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page,business:req.query['business']});
                }else{
                    if(req.session.loginbean.privilige==1){
                        res.render('zpexamine_f', { title: 'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page,business:req.query['business']});
                    }else{
                        res.render('zpindex', { title: 'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page,business:req.query['business']});
                    }
                }
            })
            conn.release();
        })
       
    },
    examine_wait_detail:function(req,res){
        tid=req.query['tid'];
        if(tid!=undefined){
            pool=connPool();
            pool.getConnection(function(err,conn){
                if(err){
                    res.send('获取链接错误，错误原因：'+err.message);
                }
                var sqldetail='select tid,nicheng,title,content,place,business,type,year,month,day,hour,minute,name,phone,email,wechat,QQ,updtime,createtime,status from employment where tid=?'
                var sqlparam=[tid];
                conn.query(sqldetail,sqlparam,function(err,rs){
                    time=moment(rs[0].createtime).format('YYYY/MM/YY HH:mm')
                    res.render('zpexamine_w_detail',{rs:rs,time:time})
                })
                conn.release();
            })
            
            
        }else{
            res.send("没传入tid")
        }
    },
    w_delete:function(req,res){
        // res.send(req.query['tid'])
        pool = connPool();
        pool.getConnection(function(err,conn){
            if(err){
                res.send('获取链接错误，错误原因：'+err.message)
            }
            var sqldelete='delete from employment where tid = ?'
            var param = [req.query['tid']]
            conn.query(sqldelete,param,function(err,rs){
                res.send('<script>alert("删除成功");location.href="/administrator/examine/wait";</script>')
            })
        })

    },
    w_pass:function(req,res){
        pool = connPool();
        pool.getConnection(function(err,conn){
            if(err){
                res.send('获取链接错误，错误原因：'+err.message)
            }
            var sqlpass='update employment set status = 1,handler=? where tid = ?'
            var param = [req.session.loginbean.nicheng,req.query['tid']]
            conn.query(sqlpass,param,function(err,rs){
                res.send('<script>alert("审核通过");location.href="/administrator/examine/wait"</script>')
            })
        })
    },
    w_fail:function(req,res){
        pool = connPool();
        pool.getConnection(function(err,conn){
            if(err){
                res.send('获取链接错误，错误原因：'+err.message)
            }
            var sqlfail='update employment set status = -1,handler=? where tid = ?'
            var param = [req.session.loginbean.nicheng,req.query['tid']]
            conn.query(sqlfail,param,function(err,rs){
                res.send('<script>alert("审核下架");location.href="/administrator/examine/wait"</script>')
            })
        })
    },
    p_delete:function(req,res){
        // res.send(req.query['tid'])
        pool = connPool();
        pool.getConnection(function(err,conn){
            if(err){
                res.send('获取链接错误，错误原因：'+err.message)
            }
            var sqldelete='delete from employment where tid = ?'
            var param = [req.query['tid']]
            conn.query(sqldelete,param,function(err,rs){
                res.send('<script>alert("删除成功");location.href="/administrator/examine/pass";</script>')
            })
        })
    },
    p_fail:function(req,res){
        pool = connPool();
        pool.getConnection(function(err,conn){
            if(err){
                res.send('获取链接错误，错误原因：'+err.message)
            }
            var sqlfail='update employment set status = -1,handler=? where tid = ?'
            var param = [req.session.loginbean.nicheng,req.query['tid']]
            conn.query(sqlfail,param,function(err,rs){
                res.send('<script>alert("审核下架");location.href="/administrator/examine/pass"</script>')
            })
        })
    },
    f_pass:function(req,res){
        pool = connPool();
        pool.getConnection(function(err,conn){
            if(err){
                res.send('获取链接错误，错误原因：'+err.message)
            }
            var sqlpass='update employment set status = 1,handler=? where tid = ?'
            var param = [req.session.loginbean.nicheng,req.query['tid']]
            conn.query(sqlpass,param,function(err,rs){
                res.send('<script>alert("审核通过");location.href="/administrator/examine/fail"</script>')
            })
        })
    },
    f_delete:function(req,res){
        // res.send(req.query['tid'])
        pool = connPool();
        pool.getConnection(function(err,conn){
            if(err){
                res.send('获取链接错误，错误原因：'+err.message)
            }
            var sqldelete='delete from employment where tid = ?'
            var param = [req.query['tid']]
            conn.query(sqldelete,param,function(err,rs){
                res.send('<script>alert("删除成功");location.href="/administrator/examine/fail";</script>')
            })
        })
    },
}
        
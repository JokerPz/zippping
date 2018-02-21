var connPool = require("./ConnPool");
var LoginBean=require("../jsbean/LoginBean")
var async=require('async')
module.exports={
    emy:function(req,res){
        loginbean = req.session.loginbean;
        pool = connPool();
        pool.getConnection(function(err,conn){
            if(err){
                res.send('获取链接错误，错误原因：'+err.message);
            }
            var userAddSql='insert into employment (title,content,uid,place,business,type,year,month,day,hour,minute,name,phone,email,wechat,QQ,createtime)  values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,current_timestamp)';
            var param=[req.body['title'],req.body['content'],loginbean.id,req.body['place'],req.body['business'],req.body['type'],req.body['year'],req.body['month'],req.body['day'],req.body['hour'],req.body['minute'],req.body['name'],req.body['phone'],req.body['email'],req.body['wechat'],req.body['QQ']]
            conn.query(userAddSql,param,function(err,rs){
                if(err){
                    //console.log('insert err:',err.message);
                    //res.send("数据库错误,错误原因:"+err.message);
                    return;
                }
                res.send('<script>alert("提问成功");location.href="../";</script>');
                // res.redirect('../');
            })
            conn.release();
        })
    },
    emyList:function(req,res,loginbean){
        pool=connPool();
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
            pageSize=2;//每页显示多少条帖子
            pointStart=(page-1)*pageSize;
            count=0;//****************** */
            countPage=0;//************* */
            var countSql='select count(tid) from employment'
            var listSql = 'select tid,title,updtime,createtime from employment order by createtime desc limit ?,?';   
            var param = [pointStart,pageSize];   
           
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
                        //res.render('index', { title: 'Express',loginbean:loginbean,rs:rs});
                        callback(null,rs)  
                    }) 
                }
            },function(err,results){
              //  console.log(results)
                // count=(results['one'][0]['count(*)'])
                // countPage=Math.ceil(count/pageSize)
                rs=(results['two'])
                //res.render('zpindex', { title: 'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page});
                if(req.session.loginbean==undefined){
                    res.render('zpindex', { title: 'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page});
                }else{
                    if(req.session.loginbean.privilige==1){
                        res.render('zpindex1', { title: 'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page});
                    }else{
                        res.render('zpindex', { title: 'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page});
                    }
                }
                
                //res.send("aaaa")
            })
            
            conn.release();
        })
    },
    emyDetail:function(req,res){
        tid=req.query['tid'];
        if(tid!=undefined){
            pool=connPool();
            pool.getConnection(function(err,conn){
                if(err){
                    res.send('获取链接错误，错误原因：'+err.message);
                }
                var sqldetail='select tid,title,content,place,business,type,year,month,day,hour,minute,name,phone,email,wechat,QQ,updtime,createtime from employment where tid=?'
                var sqlparam=[tid];
                conn.query(sqldetail,sqlparam,function(err,rs){
                    res.render('detail',{rs:rs})
                })
                conn.release();
            })
            
            
        }else{
            res.send("没传入tid")
        }
    },
    epList:function(req,res){
        uid=req.session.loginbean.id
        console.log(uid)
        //res.send('发帖列表')
        pool=connPool();
        pool.getConnection(function(err,conn){
            if(err){
                res.send('获取链接错误，错误原因：'+err.message);
            }
            var sqllist='select tid,title,createtime from employment where uid=? order by tid desc'
            var param=[uid]
            conn.query(sqllist,param,function(err,rs){
                    console.log(rs[0])
                    //res.send('发帖列表')        
                    res.render('zpeplist',{rs:rs})
            })
            conn.release();
        })
    },
    collection:function(req,res){
        uid=req.query['uid']
        tid=req.query['tid']
        rank=req.query['rank']
        title=req.query['title']
        pool=connPool();
        pool.getConnection(function(err,conn){
            if(err){
                res.send('获取连接错误，错误原因'+err.message);
            }
            var colsql='select cid from collection where uid=? and tid=?'
            var sqlparam=[uid,tid];
            var colupdate='update collection set rank=? where uid=? and tid=?'
            var updparam=[rank,uid,tid]
            var colinsert='insert into collection(uid,tid,rank,title) values(?,?,?,?)'
            var insertparam=[uid,tid,rank,title]
            conn.query(colsql,sqlparam,function(err,rs){
                if(err){
                    res.send('数据库错误，错误原因'+err.message)
                    return;
                }
                if(rs.length>0){
                    console.log('数据表存在记录'+'uid='+uid+';tid='+tid)
                    conn.query(colupdate,updparam,function(err,rs){
                        if(err){
                            res.send('数据库错误，错误原因：'+err.message)
                            return
                        }
                        console.log(rs)
                    })
                    res.redirect('/?page='+req.query['page'])
                    //res.send('数据表存在记录')
                }
                else{
                    console.log('数据表不存在记录'+'uid='+uid+';tid='+tid)
                    conn.query(colinsert,insertparam,function(err,rs){
                        if(err){
                            res.send('数据库错误，错误原因：'+err.message)
                            return
                        }
                        console.log(rs)
                    })
                    res.redirect('/?page='+req.query['page'])
                    //res.send('数据表不存在记录')
                }
            })
            conn.release();
        })
    },
    collectionList:function(req,res){
        uid=req.session.loginbean.id
        //console.log(uid)
        //res.send('发帖列表')
        pool=connPool();
        pool.getConnection(function(err,conn){
            if(err){
                res.send('获取链接错误，错误原因：'+err.message);
            }
            var sqllist='select tid,title,createtime from collection where uid=? order by tid desc'
            var param=[uid]
            conn.query(sqllist,param,function(err,rs){
                    console.log(rs[0])
                    //res.send('发帖列表')        
                    res.render('zpeplist',{rs:rs})
            })
            conn.release();
        })
    }
}
// 
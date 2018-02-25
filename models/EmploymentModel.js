var connPool = require("./ConnPool");
var LoginBean=require("../jsbean/LoginBean")
var async=require('async')
var moment = require('moment')
module.exports={
    emy:function(req,res){
        var year = moment(req.body['date']).format('YYYY');
        var month = moment(req.body['date']).format('MM')
        var day = moment(req.body['date']).format('DD');
        var e_type;
        if(req.body["type1"]!=undefined&&req.body['type2']!=undefined){
            e_type = '宣讲,面试'
        }else if(req.body["type1"]!=undefined&&req.body['type2']==undefined){
            e_type = '宣讲'
        }else if(req.body["type1"]==undefined&&req.body['type2']!=undefined){
            e_type = '面试'
        }else{
            e_type = '-'
        }
        console.log(e_type);
        loginbean = req.session.loginbean;
        console.log(req.body['type'])
        console.log(req.body['type1'])//
        pool = connPool();
        pool.getConnection(function(err,conn){
            if(err){
                res.send('获取链接错误，错误原因：'+err.message);
            }
            var userAddSql='insert into employment (title,content,uid,place,business,type,year,month,day,hour,minute,name,phone,email,wechat,QQ,createtime)  values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,current_timestamp)';
            var param=[req.body['title'],req.body['content'],loginbean.id,req.body['place'],req.body['business'],e_type,year,month,day,req.body['hour'],req.body['minute'],req.body['name'],req.body['phone'],req.body['email'],req.body['wechat'],req.body['QQ']]
            conn.query(userAddSql,param,function(err,rs){
                if(err){
                    console.log('insert err:',err.message);
                    res.send("数据库错误,错误原因:"+err.message);
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
            pageSize=15;//每页显示多少条帖子
            pointStart=(page-1)*pageSize;
            count=0;//****************** */
            countPage=0;//************* */
            
            if(req.query['business']==undefined){
                var countSql='select count(tid) from employment'
                var listSql = 'select tid,title,type,place,year,month,day,hour,minute,updtime,createtime,business from employment order by createtime desc limit ?,?';  
                var param = [pointStart,pageSize];
            }else{
                //console.log(req.query['business'])
                //console.log(req.query['business'])
                var countSql='select count(tid) from employment where business ="'+req.query['business']+'"'
                var listSql = 'select tid,title,type,place,year,month,day,hour,minute,updtime,createtime,business from employment where business="'+req.query['business']+'" order by createtime desc limit ?,?';  
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
                       // console.log("count:"+count)
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
                //console.log(rs)
                //res.render('zpindex', { title: 'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page});
                if(req.session.loginbean==undefined){
                    res.render('zpindex', { title: 'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page,business:req.query['business']});
                }else{
                    if(req.session.loginbean.privilige==1){
                        res.render('zpindex1', { title: 'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page,business:req.query['business']});
                    }else{
                        res.render('zpindex', { title: 'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page,business:req.query['business']});
                    }
                }
                //console.logconsole.log("business:"+req.query['business'])
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
                    res.render('zpdetail',{rs:rs})
                })
                conn.release();
            })
            
            
        }else{
            res.send("没传入tid")
        }
    },
    epList:function(req,res){//发帖列表
        uid=req.session.loginbean.id
        loginbean = req.session.loginbean
        //console.log(uid)
        //res.send('发帖列表')
        pool=connPool();
        pool.getConnection(function(err,conn){
            if(err){
                res.send('获取链接错误，错误原因：'+err.message);
            }
            page=1;
            if(req.query['page']!=undefined){
                page=parseInt(req.query['page']);
                if(page<1){
                    page=1;
                }
            }
            pageSize=10;//每页显示多少条帖子
            pointStart=(page-1)*pageSize;
            count=0;//****************** */
            countPage=0;//************* */

            if(req.query['business']==undefined){
                var countSql='select count(tid) from employment where uid=?'
                var countparam=[uid]
                var sqllist='select tid,title,type,place,year,month,day,hour,minute,updtime,createtime from employment where uid=? order by tid desc limit ?,?'
                var listparam=[uid,pointStart,pageSize]
            }else{
                var countSql='select count(tid) from employment where uid=? and business ="'+req.query['business']+'"'
                var countparam=[uid]
                var sqllist='select tid,title,type,place,year,month,day,hour,minute,updtime,createtime from employment where uid=? and business ="'+req.query['business']+'" order by tid desc limit ?,?'
                var listparam=[uid,pointStart,pageSize]
            }

            async.series({
                one:function(callback){
                    conn.query(countSql,countparam,function(err,rs){ 
                        count=rs[0]['count(tid)']
                        countPage=Math.ceil(count/pageSize)
                        //console.log("countPage:"+countPage)
                        //console.log("page:"+page)
                        if(page>countPage){
                            page=countPage
                            //console.log("page1:"+page)
                            pointStart=(page-1)*pageSize;

                        }
                       // console.log("count:"+count)
                       listparam = [uid,pointStart,pageSize]
                        callback(null,rs)
                    })   
                },
                two:function(callback){
                    conn.query(sqllist,listparam,function(err,rs){   
                        callback(null,rs)  
                    }) 
                }
            },function(err,results) {
                rs=(results['two'])
                res.render('zpeplist',{title:'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page,business:req.query['business'],web:1})
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
            var colinsert='insert into collection(uid,tid,rank,title,type,year,month,day,hour,minute,place,business) values(?,?,?,?,?,?,?,?,?,?,?,?)'
            var insertparam=[uid,tid,rank,title,req.query['type'],req.query['year'],req.query['month'],req.query['day'],req.query['hour'],req.query['minute'],req.query['place'],req.query['business']]
            conn.query(colsql,sqlparam,function(err,rs){
                if(err){
                    res.send('数据库错误，错误原因'+err.message)
                    return;
                }
                if(rs.length>0){
                    // console.logconsole.log('数据表存在记录'+'uid='+uid+';tid='+tid)
                    conn.query(colupdate,updparam,function(err,rs){
                        if(err){
                            res.send('数据库错误，错误原因：'+err.message)
                            return
                        }
                        // console.log(rs)
                    })
                    res.redirect('/?page='+req.query['page'])
                    //res.send('数据表存在记录')
                }
                else{
                    // console.log('数据表不存在记录'+'uid='+uid+';tid='+tid)
                    conn.query(colinsert,insertparam,function(err,rs){
                        if(err){
                            // console.log('数据库错误，错误原因：'+err.message)
                            res.send('数据库错误，错误原因：'+err.message)
                           
                            return
                        }
                        // console.log(rs)
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
        loginbean = req.session.loginbean
        //console.log(uid)
        //res.send('发帖列表')
        pool=connPool();
        pool.getConnection(function(err,conn){
            if(err){
                res.send('获取链接错误，错误原因：'+err.message);
            }
            page=1;
            if(req.query['page']!=undefined){
                page=parseInt(req.query['page']);
                if(page<1){
                    page=1;
                }
            }
            pageSize=10;//每页显示多少条帖子
            pointStart=(page-1)*pageSize;
            count=0;//****************** */
            countPage=0;//************* */

            if(req.query['business']==undefined){
                var countSql = 'select count(cid) from collection where uid=?'
                var countparam=[uid]
                var sqllist='select tid,title,type,year,month,day,hour,minute,place,createtime from collection where uid=? order by tid desc limit ?,?'
                var listparam=[uid,pointStart,pageSize]
            }else{
                var countSql = 'select count(cid) from collection where uid=? and business = "'+req.query['business']+'"'
                
                var countparam=[uid]
                var sqllist='select tid,title,type,year,month,day,hour,minute,place,createtime from collection where uid=? and business="'+req.query['business']+'" order by tid desc limit ?,?'
                var listparam=[uid,pointStart,pageSize]
            }   
            
            async.series({
                one:function(callback){
                    conn.query(countSql,countparam,function(err,rs){
                        count=rs[0]['count(cid)']
                        // console.log("count:"+count)
                        countPage=Math.ceil(count/pageSize)
                        if(page>countPage){
                            page=countPage
                            // console.log("page1:"+page)
                            pointStart=(page-1)*pageSize;
                        }
                        listparam = [uid,pointStart,pageSize]
                        callback(null,rs)
                    })
                },
                two:function(callback){
                    conn.query(sqllist,listparam,function(err,rs){ 
                        callback(null,rs)
                    })
                }
            },function(err,results){
                rs=(results['two'])
                res.render('zpeplist',{title:'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page,business:req.query['business'],web:2})
            })
            conn.release();
        })
    }
}

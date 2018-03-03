var connPool = require("./ConnPool");
var LoginBean=require("../jsbean/LoginBean")
var async=require('async')
var moment = require('moment')
module.exports={
    emy:function(req,res){//发帖操作
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
            var userAddSql='insert into employment (title,content,uid,nicheng,place,business,type,year,month,day,hour,minute,name,phone,email,wechat,QQ,createtime)  values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,current_timestamp)';
            var param=[req.body['title'],req.body['content'],loginbean.id,loginbean.nicheng,req.body['place'],req.body['business'],e_type,year,month,day,req.body['hour'],req.body['minute'],req.body['name'],req.body['phone'],req.body['email'],req.body['wechat'],req.body['QQ']]
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
    emyList:function(req,res,loginbean){//返回帖子首页列表
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
            
            

            if(req.query['business']==undefined&&req.session.loginbean==undefined){
                var countSql='select count(tid) from employment where status=1'
                var listSql = 'select tid,title,type,place,year,month,day,hour,minute,updtime,createtime,business from employment where status=1 order by MONTH*1000000+DAY*10000+HOUR*100+MINUTE DESC limit ?,?';  
                var param = [pointStart,pageSize];
            }else if(req.query['business']!=undefined&&req.session.loginbean==undefined){
                var countSql='select count(tid) from employment  where status=1 and business ="'+req.query['business']+'"'
                var listSql = 'select tid,title,type,place,year,month,day,hour,minute,updtime,createtime,business from employment where status=1 and business="'+req.query['business']+'" order by MONTH*1000000+DAY*10000+HOUR*100+MINUTE DESC limit ?,?';
                var param = [pointStart,pageSize];
                
            }else if(req.query['business']==undefined&&req.session.loginbean!=undefined){
                var countSql='select count(tid) from employment where status=1'
                var listSql = 'select e.tid,e.title,e.type,e.place,e.year,e.month,e.day,e.hour,e.minute,e.updtime,e.createtime,e.business,c.cid from employment e left join collection c on e.tid=c.tid and c.uid ='+req.session.loginbean.id+' where e.status=1 order by e.MONTH*1000000+e.DAY*10000+e.HOUR*100+e.MINUTE DESC limit ?,?';  
                var param = [pointStart,pageSize];
            }else{
                var countSql='select count(tid) from employment  where status=1 and business ="'+req.query['business']+'"'
                var listSql = 'select e.tid,e.title,e.type,e.place,e.year,e.month,e.day,e.hour,e.minute,e.updtime,e.createtime,e.business,c.cid from employment e left join collection c on e.tid=c.tid and c.uid ='+req.session.loginbean.id+' where e.status=1 and e.business="'+req.query['business']+'" order by e.MONTH*1000000+e.DAY*10000+e.HOUR*100+e.MINUTE DESC limit ?,?';
                console.log(listSql)  
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
                //res.render('zpindex', { title: 'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page});
                if(req.session.loginbean==undefined){
                    res.render('zpindex', { title: 'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page,business:req.query['business']});
                }else{
                    if(req.session.loginbean.privilige==1){
                        res.render('zpindex_admin', { title: 'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page,business:req.query['business']});
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
                if(req.session.loginbean!=undefined){
                    var sqldetail='SELECT e.tid,e.title,e.content,e.place,e.business,e.type,e.year,e.month,e.day,e.hour,e.minute,e.name,e.phone,e.email,e.wechat,e.QQ,e.updtime,e.createtime,c.cid FROM employment e LEFT JOIN collection c ON e.`tid`=c.`tid` AND c.uid= '+req.session.loginbean.id+' WHERE e.tid=?'
                    console.log('sqldetail'+sqldetail)
                }else{
                    var sqldetail='SELECT e.tid,e.title,e.content,e.place,e.business,e.type,e.year,e.month,e.day,e.hour,e.minute,e.name,e.phone,e.email,e.wechat,e.QQ,e.updtime,e.createtime FROM employment e  WHERE e.tid=?'
                }
                var sqlparam=[tid];
               
                conn.query(sqldetail,sqlparam,function(err,rs){
                    if(req.session.loginbean==undefined){
                        res.render('zpdetail',{rs:rs,loginbean:req.session.loginbean})
                    }else if(req.session.loginbean.privilige==1){
                        res.render('zpdetail_admin',{rs:rs,loginbean:req.session.loginbean})
                    }else{
                        res.render('zpdetail',{rs:rs,loginbean:req.session.loginbean})
                    }
                   
                })
                conn.release();
            })
            
            
        }else{
            res.send("没传入tid")
        }
    },
    epList:function(req,res){//发帖列表 不需要判断是否通过，但需要加待审核，不通过等
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
            pageSize=15;//每页显示多少条帖子
            pointStart=(page-1)*pageSize;
            count=0;//****************** */
            countPage=0;//************* */

            if(req.query['business']==undefined){
                var countSql='select count(tid) from employment where uid=?'
                var countparam=[uid]
                var sqllist='select tid,title,type,place,year,month,day,hour,minute,updtime,createtime,business,status from employment where uid=? order by MONTH*1000000+DAY*10000+HOUR*100+MINUTE desc limit ?,?'
                var listparam=[uid,pointStart,pageSize]
            }else{
                var countSql='select count(tid) from employment where uid=? and business ="'+req.query['business']+'"'
                var countparam=[uid]
                var sqllist='select tid,title,type,place,year,month,day,hour,minute,updtime,createtime,business,status from employment where  uid=? and business ="'+req.query['business']+'" order by MONTH*1000000+DAY*10000+HOUR*100+MINUTE desc limit ?,?'
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
                if(req.session.loginbean.privilige==1){
                    res.render('zpeplist_admin',{title:'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page,business:req.query['business'],web:1})
                }else{
                    res.render('zpeplist',{title:'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page,business:req.query['business'],web:1})
                }
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
                    switch(req.query['back']){
                        case '0':
                            res.redirect('/?page='+req.query['page']);
                            break;
                        case '1':
                            res.redirect('/?page='+req.query['page']+'&business='+req.query['business']);
                            break;
                        case '2':
                        res.redirect('/employment/eplist?page='+req.query['page']);
                            break;
                        case '3':
                            res.redirect('/employment/eplist?page='+req.query['page']+'&business='+req.query['business']);
                            break;
                        case '6':
                            res.redirect('/employment/detail?tid='+req.query['tid']);
                            break;
                    }
                    console.log("back:"+req.query['back'])
                   // res.redirect('/?page='+req.query['page'])
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
                    console.log("back:"+req.query['back'])
                    switch(req.query['back']){
                        case '0':
                            res.redirect('/?page='+req.query['page']);
                            break;
                        case '1':
                            res.redirect('/?page='+req.query['page']+'&business='+req.query['business']);
                            break;
                        case '2':
                            res.redirect('/employment/eplist?page='+req.query['page']);
                            break;
                        case '3':
                            res.redirect('/employment/eplist?page='+req.query['page']+'&business='+req.query['business']);
                            break;
                        case '6':
                            res.redirect('/employment/detail?tid='+req.query['tid']);
                            break;

                    }
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
            pageSize=15;//每页显示多少条帖子
            pointStart=(page-1)*pageSize;
            count=0;//****************** */
            countPage=0;//************* */

            if(req.query['business']==undefined){
                var countSql = 'select count(cid) from collection where uid=?'
                var countparam=[uid]
                var sqllist='select tid,title,type,year,month,day,hour,minute,place,createtime from collection where uid=? order by MONTH*1000000+DAY*10000+HOUR*100+MINUTE desc limit ?,?'
                var listparam=[uid,pointStart,pageSize]
            }else{
                var countSql = 'select count(cid) from collection where uid=? and business = "'+req.query['business']+'"'
                
                var countparam=[uid]
                var sqllist='select tid,title,type,year,month,day,hour,minute,place,createtime from collection where uid=? and business="'+req.query['business']+'" order by MONTH*1000000+DAY*10000+HOUR*100+MINUTE desc limit ?,?'
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
                if(req.session.loginbean.privilige==1){
                    res.render('zpeplist_admin',{title:'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page,business:req.query['business'],web:2})//web用于发帖列表与收藏列表的翻页条件区别                  
                }else{
                    res.render('zpeplist',{title:'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page,business:req.query['business'],web:2})//web用于发帖列表与收藏列表的翻页条件区别
                }
                
            })
            conn.release();
        })
    },
    collectionDel:function(req,res){
        uid=req.query['uid']
        tid=req.query['tid']
        //console.log("page:"+req.query['page'])
        pool=connPool();
        pool.getConnection(function(err,conn){
            if(err){
                res.send('获取连接错误，错误原因'+err.message);
            }
            var delsql='delete from collection where uid=? and tid=?'
            var param=[uid,tid]
            conn.query(delsql,param,function(err,rs){
                if(err){
                    res.send('数据库错误，错误原因'+err.message)
                    return;
                }
                switch(req.query['back']){
                    case '0':
                        res.redirect('/?page='+req.query['page']);
                        break;
                    case '1':
                        res.redirect('/?page='+req.query['page']+'&business='+req.query['business']);
                        break;
                    case '2':
                    res.redirect('/employment/eplist?page='+req.query['page']);
                        break;
                    case '3':
                        res.redirect('/employment/eplist?page='+req.query['page']+'&business='+req.query['business']);
                        break;
                    case '4':
                        res.redirect('/employment/collection/list?page='+req.query['page']);
                        break;
                    case '5':
                        res.redirect('/employment/collection/list?page='+req.query['page']+'&business='+req.query['business']);
                        break;
                    case '6':
                        res.redirect('/employment/detail?tid='+req.query['tid']);
                        break;
                }
            })
            conn.release();
        })
    }
}

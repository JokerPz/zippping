var connPool = require("./ConnPool");
var LoginBean=require("../jsbean/LoginBean")
var async=require('async')
module.exports={
    ask:function(req,res){
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
    queList:function(req,res,loginbean){
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
                res.render('zpindex', { title: 'Express',loginbean:loginbean,rs:rs,count:count,countPage:countPage,page:page});
                //res.send("aaaa")
            })
            
            conn.release();
        })
    },
    queDetail:function(req,res){
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
}
// 
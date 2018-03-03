

// 从服务器获得收藏信息

// function getclick() {
// 	var like=  ;// 从服务器获得收藏状态，这部分你看下从后台要怎样实现
// 	var checkimg = document.getElementById("checkimg");
// 	if(like){
// 		checkimg.src="../images/Star_S_1.png";
// 		checkimg.alt="收藏";		
// 	} else {
// 	    checkimg.src="../images/Star_S_0.png";
// 	    checkimg.alt="未收藏";		
// 	}
// 	// body...
// }

// 收藏星星
function checkclick(){
	var checkimg = document.getElementById("checkimg");
	if($("#one-box").is(':checked') ){
	    // $("#one-box").attr("checked","unchecked");
	    checkimg.src="/images/Star_S_1.png";
	    checkimg.alt="收藏";
	} else{
	    // $("#one-box").attr("checked","checked");
	    checkimg.src="/images/Star_S_0.png";
	    checkimg.alt="未收藏";
	}
}


// 收藏数据传递
function uplike() {
	// var like=document.getElementsById("one-box");
	var like = $("input[type='checkbox']").is(':checked');

	$.ajax({
		type:"POST",
		url:"/employment/aaa", // 提交到后台的路径
		data:{'checked':like}
	})
}


// function like(){//这个方法是将DOM对象里面名字为like的都找出来.然后被选中的加入到json传递.用ajax交互
//     var list =new Array();
//     var check=document.getElementsByName("like");
//     for(var i=0;i<check.length;i++){
//         if(check[i].checked==true){//检查checkbox是否已选中
//             list.push(check[i].value);
//         }
//     }



/*$.ajax({//通过ajax传给一个servlet处理
    type:"POST", //请求方式
    url:"/likeList", //请求路径
    data:{"list":list,
        "id":<%=id
    %>},
    dataType : 'json',
    success:function(result){
    }
});*/




// 验证码
function veri(){
var sourcenum="0123456789abcdefghijklmnopqrstuvwxyz";
var siglenum="";
var checknum="";
var index=0;
for(i=0;i<8;i++){
index=(Math.random()*100)%35;
siglenum=sourcenum.substring(index,index+1);
checknum+=siglenum;
i++;
}
document.form1.txt_ver.value=checknum;
}
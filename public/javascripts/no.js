var wait=60;
function time(o) {
  if (wait == 0) {
   o.removeAttribute("disabled");   
   o.value="获取验证码";
   wait = 60;
  } else { 
   o.setAttribute("disabled", true);
   o.value="重新发送(" + wait + ")";
   wait--;
   setTimeout(function() {
	time(o)
   },
   1000)
  }
 }

 function noChoose() {
    if ( ( $(":input[name='place']").val()=="" && ($(":radio[name='type']:checked").val()==1) )||  ( $(":input[name='place']").val()!="" && ($(":radio[name='type']:checked").val()!=NULL) ) )
        alert("选择[线下]时需填写[活动地点]");
}

$(function() {
    $( "#datepicker" ).datepicker({
        inline: true
    });
});


// $(function(){
// 	$("#btn").click(function() {
// 		$.get("/users/register",{acc:$("#acc".val())},function() {
// 			alert("123");
// 		});
// 	})
// })


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
// function uplike() {
// 	// var like=document.getElementsById("one-box");
// 	var like = $("input[type='checkbox']").is(':checked');

// 	$.ajax({
// 		type:"POST",
// 		url:"/employment/aaa", // 提交到后台的路径
// 		data:{'checked':like}
// 	})
// }
function black_start(){
  alert("需登录后，才能执行收藏功能")
}

function cancel_collection(){
	var r=confirm("确认取消收藏？");
	if(r==true){
		location.href='/employment/collection/del?uid=<%= loginbean.id %>&tid=<%=row['tid']%>&page=<%=page %>&back=4';
	}else{
		
	}
}
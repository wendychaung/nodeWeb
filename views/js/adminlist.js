$(function () {
	$(".del").click(function () {
		var id=$(this).attr("data-id");
		var obj=$(this);
		$.ajax({
			type:"DELETE",
			url:"/del?id=" + id
		})
		.done(function(results) {
			if(results.success === 1) {
				console.log("success");
				obj.parent("li").remove();
			}
		})
	});
	
});